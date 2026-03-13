import cv2
import mediapipe as mp
import numpy as np
import argparse
import os
import math

class BoxingAnalyzer:
    def __init__(self):
        self.points_of_interest = []

    def analyze_pose(self, landmarks):
        errors = []
        self.points_of_interest = []

        if not landmarks:
            return errors

        # MediaPipe Landmark Indices
        NOSE = 0
        L_SHOULDER = 11
        R_SHOULDER = 12
        L_WRIST = 15
        R_WRIST = 16
        L_ANKLE = 27
        R_ANKLE = 28

        nose = landmarks[NOSE]
        l_shoulder = landmarks[L_SHOULDER]
        r_shoulder = landmarks[R_SHOULDER]
        l_wrist = landmarks[L_WRIST]
        r_wrist = landmarks[R_WRIST]
        l_ankle = landmarks[L_ANKLE]
        r_ankle = landmarks[R_ANKLE]

        # Check visibilities (ensure we can see the joints)
        visible = lambda lm: lm.visibility > 0.5

        # Heuristic 1: Hands too low (below shoulders)
        # In frame coordinates, y=0 is top, y=1 is bottom. Lower value means higher up.
        avg_shoulder_y = (l_shoulder.y + r_shoulder.y) / 2.0
        
        if visible(l_wrist) and l_wrist.y > l_shoulder.y + 0.05:
            errors.append({
                "id": "1",
                "title": "Lead Hand Too Low",
                "desc": "Lead guard dropped - chin exposed. Raise hand.",
                "landmarks": [L_WRIST, L_SHOULDER]
            })
            self.points_of_interest.extend([L_WRIST])
            
        if visible(r_wrist) and r_wrist.y > r_shoulder.y + 0.05:
            errors.append({
                "id": "2",
                "title": "Rear Hand Too Low",
                "desc": "Rear hand dropped - face exposed.",
                "landmarks": [R_WRIST, R_SHOULDER]
            })
            self.points_of_interest.extend([R_WRIST])

        # Heuristic 2: Chin up
        # We estimate chin based on nose and shoulders. If nose is too far above shoulders, chin is likely up.
        # Normally you want the chin tucked.
        shoulder_dist = math.sqrt((l_shoulder.x - r_shoulder.x)**2 + (l_shoulder.y - r_shoulder.y)**2)
        if visible(nose) and visible(l_shoulder):
             # If distance between nose and shoulder line is 'large', chin is untucked
             if avg_shoulder_y - nose.y > shoulder_dist * 0.8:
                 errors.append({
                     "id": "3",
                     "title": "Chin Up - Head Exposed",
                     "desc": "Chin is elevated - tuck chin to chest.",
                     "landmarks": [NOSE]
                 })
                 self.points_of_interest.append(NOSE)

        return errors

def draw_overlay(frame, errors, width, height, landmarks=None):
    if not errors:
        return frame

    # Draw red circles on points of interest
    if landmarks:
        for err in errors:
            for lm_idx in err.get("landmarks", []):
                lm = landmarks[lm_idx]
                x, y = int(lm.x * width), int(lm.y * height)
                cv2.circle(frame, (x, y), 15, (0, 0, 255), -1)
                cv2.circle(frame, (x, y), 18, (255, 255, 255), 2)
                # Draw ID
                cv2.putText(frame, err["id"], (x - 5, y + 5), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)

    # Draw bottom panel
    panel_height = 150
    overlay = frame.copy()
    cv2.rectangle(overlay, (0, height - panel_height), (width, height), (20, 10, 10), -1)
    # Alpha blend
    alpha = 0.8
    frame = cv2.addWeighted(overlay, alpha, frame, 1 - alpha, 0)
    
    # Draw text
    y_offset = height - panel_height + 30
    for err in errors:
        # ID circle
        cv2.circle(frame, (30, y_offset - 5), 10, (0, 0, 255), -1)
        cv2.putText(frame, err["id"], (26, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
        
        # Title
        cv2.putText(frame, f"[!!] {err['title']}", (50, y_offset), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 2)
        # Desc
        cv2.putText(frame, err["desc"], (50, y_offset + 20), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.4, (150, 150, 150), 1)
        
        y_offset += 50
        if y_offset > height - 20:
            break

    return frame

def process_video(input_path, output_path, speed=1.0):
    print(f"Processing video: {input_path}")
    
    # Initialize MediaPipe Pose
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(
        static_image_mode=False,
        model_complexity=2, # 0, 1, or 2 (2 is most accurate, slowest)
        enable_segmentation=False,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )
    mp_drawing = mp.solutions.drawing_utils
    mp_drawing_styles = mp.solutions.drawing_styles

    # Open video capture
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        print(f"Error: Could not open video {input_path}")
        return

    # Get video properties
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Video Info: {width}x{height} @ {fps} FPS, {frame_count} frames total.")

    # Define the codec and create VideoWriter object
    fourcc = cv2.VideoWriter_fourcc(*'mp4v') # type: ignore
    out_fps = fps * speed
    print(f"Output Video FPS: {out_fps}")
    out = cv2.VideoWriter(output_path, fourcc, out_fps, (width, height))

    analyzer = BoxingAnalyzer()

    frame_idx = 0
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break
            
        frame_idx += 1
        if frame_idx % 30 == 0:
            print(f"Processing frame {frame_idx}/{frame_count}")

        frame.flags.writeable = False
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        results = pose.process(rgb_frame)

        frame.flags.writeable = True
        annotated_frame = frame.copy()

        if results.pose_landmarks:
            # Draw basic landmarks for now
            mp_drawing.draw_landmarks(
                annotated_frame,
                results.pose_landmarks,
                mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style()
            )
            
            # Analyze pose
            errors = analyzer.analyze_pose(results.pose_landmarks.landmark)
            
            # Draw custom overlays
            annotated_frame = draw_overlay(annotated_frame, errors, width, height, results.pose_landmarks.landmark)

        # Write the annotated frame
        out.write(annotated_frame)

    cap.release()
    out.release()
    print(f"Processing complete! Saved to: {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='AI Boxing Analyst')
    parser.add_argument('-i', '--input', type=str, required=True, help='Path to input video file')
    parser.add_argument('-o', '--output', type=str, default='output.mp4', help='Path to output video file')
    parser.add_argument('-s', '--speed', type=float, default=1.0, help='Playback speed multiplier (e.g. 0.5 for half speed)')
    args = parser.parse_args()
    
    if os.path.exists(args.input):
        process_video(args.input, args.output, args.speed)
    else:
        print(f"Error: Input file {args.input} does not exist.")

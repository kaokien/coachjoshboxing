import cv2
import numpy as np

width, height = 640, 480
fps = 30
duration = 2
out = cv2.VideoWriter('test_video.mp4', cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))

for i in range(fps * duration):
    frame = np.zeros((height, width, 3), dtype=np.uint8)
    cv2.circle(frame, (width//2, height//2), 30, (255, 255, 255), -1)
    out.write(frame)
out.release()

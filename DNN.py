import cv2
# 加载模型
net = cv2.dnn.readNetFromTorch(r'C:\Users\wuzhiqiang\Desktop\fast-neural-style\models\models\instance_norm\feathers.t7')
net.setPreferableBackend(cv2.dnn.DNN_BACKEND_OPENCV);
# 读取图片
image = cv2.imread(r'C:\Users\wuzhiqiang\Desktop\493976675214534264.jpg')
(h, w) = image.shape[:2]
h_out = 100
w_out = int(w/h * h_out)
blob = cv2.dnn.blobFromImage(image, 1.0, (w_out*6, h_out*6), (103.939, 116.779, 123.680), swapRB=False, crop=False)
# 进行计算
net.setInput(blob)
out = net.forward()
out = out.reshape(3, out.shape[2], out.shape[3])
out[0] += 103.939
out[1] += 116.779
out[2] += 123.68
out /= 255
out = out.transpose(1, 2, 0)
# 输出图片
cv2.imshow(r'C:\Users\wuzhiqiang\Desktop\justice.jpg', out)
cv2.waitKey(0)

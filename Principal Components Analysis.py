import numpy as np
import pandas as pd

#PCA数学原理：通过线性变换矩阵A将原始N维数据X映射到以A的列向量为基的K维空间中，形成新的线性无关数据集Y
#目标函数为Y-i（Y的第i个变量）的方差尽可能大，说明数据尽可能分散，没有聚集在一起产生重叠现象；另一个为Y-i与Y-j的协方差尽可能趋近于0，使得数据集Y线性无关




# data格式为m*n，其中m行为样本量，n列为特征变量维度
def PCA(data, n, k):
    #参数名称：data为进入的数据集，n为因变量y所在索引排序，k为设定的k维线性变黄空间
    data = data.drop(data.columns[n], axis=1) #剔除因变量
    data_avg = data.sub(data.mean(axis=0), axis=1) #归一化计算
    Cov_Mat = data_avg.T.dot(data_avg) / float(len(data_avg)-1) #计算协方差矩阵
    eigenvalue, eigenvector = np.linalg.eig(Cov_Mat) #计算特征值及特征向量
    # 根据特征值及向量返回线性变换矩阵A，注意矩阵A从1开始索引，如需要选择4维空间，则k=4，而非常见的k=3
    LinearMapping = pd.DataFrame(eigenvector, columns=eigenvalue).T.sort_index(ascending=False).iloc[:k, :]
    #返回变换后的数据集Y， 线性变换矩阵A
    return np.array(data).dot(LinearMapping.T), LinearMapping
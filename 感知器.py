# -*- coding: utf-8 -*-
import numpy as np
import pandas as pd

def Perceptron(data, n, alpha=0.01,error_times=3):
    #改成浮点数，方便后续计算
    data = data.astype(float)
    #选出特征变量数据集
    X = data.drop(data.columns[n], axis=1)
    #选出因变量数据集
    Y = data.iloc[:, n]
    #添加“截距”项数据
    X['Xb'] = -np.ones(len(X))
    #假设初始W系数及b系数
    W = np.ones((len(X.columns), 1)) * 0.001
    error = pd.Series(np.ones(len(Y)))
    while len(error[error==0]) < (len(error) - error_times): #终止条件为划分错误个数小于等于error_times
        for i in X.index:
            Y_predict = np.where((X.iloc[i, :]).dot(W) > 0.0, 1, -1)
            W = W + alpha * np.array((Y[i] - Y_predict[0]) * X.iloc[i, :]).reshape(len(X.iloc[i, :]), 1)#更新权重向量W，若划分正确，则Y-Y_predict为0，权重向量W不产生变化
        Y_predict_mertic = pd.Series(np.where(X.dot(W) > 0.0, 1, -1).T[0])
        error = Y - Y_predict_mertic
        
    return W





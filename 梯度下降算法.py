# -*- coding: utf-8 -*-
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
#X的格式应该是为m*（n+1）(m是指存在m行样本值，n是指存在n个自变量，1是截距个数)，Y的格式为m*1（m同X的规定），params为（n+1）*1（n为自变量的回归系数个数，1是截距个数）
def func(X,params):        #向量化回归函数
    return X.dot(params)

def cost(X,Y,params):      #向量化代价函数
    return ((func(X,params) - Y)**2).mean()

def normalization(data):
    distance = data.max(axis=0)-data.min(axis=0)
    return data.sub(distance,axis=1).div(distance,axis=1)

def gradient_descent(X,Y,alpha=0.001,threshold=0.0001,times=100000):
    threshold = 0.0001
    alpha = 0.0001
    count = 0
    error_list = {}
    params = np.zeros((X.shape[1],1))
    params_list = {}

    while count <= times:
        if count == 0:
            error = cost(X,Y,params)
            error_list[count] = error
            params_list[count] = params
            params -= alpha * (((X.dot(params)-Y).T).dot(X)).T.mean() / len(Y)
            count += 1
            error = cost(X,Y,params)
            error_list[count] = error
            params_list[count] = params
        else:
            if abs(error-error_list[count-1]) > threshold:
                params -= alpha * (((X.dot(params)-Y).T).dot(X)).T.mean() / len(Y)
                count += 1
                error = cost(X,Y,params)
                error_list[count] = error
                params_list[count] = params
            else:
                break
    return params
    print 'we run this model by %d times'%count
        
    
    
    
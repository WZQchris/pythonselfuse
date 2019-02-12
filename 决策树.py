# -*- coding: utf-8 -*-
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd


#信息熵的概念：熵在信息论中代表随机变量不确定度的度量
#熵越大，数据的不确定性越高；熵越小，数据的不确定性越低
# 信息熵函数   H = (-p[i] *np.log(p[i])).sum()        #假设一共有k类变量m个样本，其中p[i]是指对应的第i个变量中的样本量n/m
#例如：p = [1/3.0,1/3.0,1/3.0]，则H = （-1/3.0*log(1/3.0) -1/3.0*log(1/3.0) -1/3.0*log(1/3.0)）

#因此，根据信息熵的特点，可以联想到在decision trees 中，
#若一批临界值变量中存在某一值X[i]，使得二分类后的信息熵度量函数H无限接近于0，则认为该变量是该节点的最优解。


def D_entropy(data,n):  # 计算总信息熵，其中data是数据集，n为因变量所在列索引
    p = data.iloc[:,n].groupby(data[data.columns[n]]).count() / len(data)
    entropy_all = -(p * np.log(p)).sum()
    return entropy_all,p
    
def condition_entropy(data,n,value): #计算条件熵，其中data是数据集，n为因变量所在列索引，value为对应自变量的字段名称
#令p_all[i] 为value自变量的分类个数 x[i] / 样本总值  ，p[i]为value自变量分类（如性别分为‘0,1’二分类）下因变量分类结果个数y[i] / x[i]
#则有条件熵 = (（(p[i] * log(p[i]).sum()）* p_all[i]).sum()    
    p_all = data[value].groupby(data[value]).count() / len(data) 
    grouped = data.groupby([value, data.columns[n]])[value].count().unstack(0).astype(float).fillna(0)
    p = grouped.div(grouped.sum(axis=0), axis=1)
    if len((p * np.log(p)).fillna(0).sum(axis=0)) != len(p_all):
        return D_entropy(data, n)[0]
    else:
        return -(((p * np.log(p)).fillna(0).sum(axis=0)) * p_all).sum()

def KLIC(data,n):
    klic_dit = {}
    #循环计算每个变量的总信息熵、条件熵、信息增益
    for value in data.columns[n+1:]:
        entropy_all, p = D_entropy(data,n)
        condi_entropy = condition_entropy(data,n,value)
        klic_dit[value] = entropy_all - condi_entropy
    select_value = max(klic_dit, key=klic_dit.get)
    return select_value
    #根据之前选定的最优变量进行划分

def max_dit(data,n):
# 返回元组，第一个输出值是对应的众数值，第二个输出是对应的出现次数
    max_dit = {}
    for i in set(list(data.iloc[:, n])):
        max_dit[i] = list(data.iloc[:, n]).count(i)
    return (max(max_dit, key=max_dit.get), max_dit[max(max_dit, key=max_dit.get)])


def DecisonTree(data, n, q=5,):
    type_variable_dit = {}
    try:
        select_value = KLIC(data, n)
        type_value_dit = {}
        for type_value in data[select_value].unique():
            type_data = data[data[select_value] == type_value].drop(select_value, axis=1)
            if D_entropy(type_data, n)[0] >= 0.8:
               type_value_dit[type_value] = max_dit(type_data, n)
            else:
                if len(type_data) <= q:
                  type_value_dit[type_value] = max_dit(type_data, n)
                elif len(type_data.columns) <= 1:
                 type_value_dit[type_value] = max_dit(type_data, n)
                else:
                 type_value_dit[type_value] = DecisonTree(type_data,n,q=5)
        type_variable_dit[select_value] = type_value_dit
        return type_variable_dit
    except:
        print(type_value)

    

#信息增益进行筛选的缺点在于如果某些自变量中分类很多，但是其对应的因变量类型很少，使得最终信息增益很大，
#但是很有可能这类自变量与因变量之间并不存在多少关系，可以做变量剔除

        
#基尼系数计算特征划分

#data为入参数据，n为因变量所在列索引 
def GINI(data, n):
    p = data.groupby(data.columns[n])[data.columns[n]].count().astype(float) / len(data)
    return 1 - (p**2).sum()

#同上，value为需要计算的自变量名称
def Condition_GINI(data, n, value):
    p_gini =  data.groupby([value, data.columns[n]])[data.columns[n]].count().unstack(1).fillna(0).div(data.groupby([value, data.columns[n]])[data.columns[n]].count().unstack(1).sum(axis=1), axis=0)
    gini = 1 - (p_gini**2).sum(axis=1)
    p = data.groupby(value).count()[data.columns[n]] / len(data)
    return (p*gini).sum()        




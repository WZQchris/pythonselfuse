# -*- coding: utf-8 -*-
import numpy as np
import pandas as pd

def Euclidean_Metric(test, data, n):
# 返回结果中columns为test数据集样本索引，index为data训练集样本索引
# 其中test为测试集，data为样本集， n为样本集中分类类别的所在columns索引
    metric = pd.DataFrame(index=test.index)
    for i in test.index:
        distance = np.sqrt(np.square(data.drop(data.columns[n], axis=1).sub(test.iloc[i, :], axis=1)).sum(axis=1).astype(float))
        metric[i] = distance
    return metric

def KNN(test, data, n, k):
# 其中test为测试集，data为样本集， n为样本集中分类类别的所在columns索引， k表示选择离测试点内取k个样本
    metric = Euclidean_Metric(test, data)
    test['result'] = np.NaN
    for i in metric.columns:
        distance = metric.iloc[:, i].sort_values()[:k]
        distance_weight = 1 / distance
        sample = pd.merge(data, pd.DataFrame(distance), how='inner', left_index=True, right_index=True)
        result = sample.iloc[:, n].value_counts()
        test.loc[i, 'result'] = result.max().index.format()[0]
        
        
                





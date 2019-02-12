# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np
import sklearn as sk
import statsmodels.api as sm

data = pd.read_excel(r'E:\python\python自己产出\统计学学习数据.xlsx', sheet_name=2)
data.drop(data.columns[0], axis=1, inplace=True)

data.loc[data['上大学否']=='否', '上大学否'] = 0 #设定未上大学定义为-1 #逻辑回归分类器需要设置为0
data.loc[data['上大学否']!= 0, '上大学否'] = 1   #设定上大学定义为1
data.loc[data['性别']=='男', '性别'] = 0 #设定男性为0
data.loc[data['性别']=='女', '性别'] = 1 #设定女性为1
data.loc[data['家庭条件']=='农村', '家庭条件'] = 0 #设定农村为0
data.loc[data['家庭条件']=='工人', '家庭条件'] = 1 #设定工人家庭为1
data.loc[data['家庭条件']=='商人', '家庭条件'] = 2 #设定商人家庭为2
data.loc[data['家庭条件']=='知识分子', '家庭条件'] = 3 #设定知识分子家庭为3
data.loc[data['高中类型']=='农村高中', '高中类型'] = 0 #设定在农村高中就读为0
data.loc[data['高中类型']=='普通高中', '高中类型'] = 1 #设定在普通高中就读为1
data.loc[data['高中类型']=='市重点', '高中类型'] = 2 #设定在市重点就读为2
data.loc[data['高中类型']=='省重点', '高中类型'] = 3 #设定在省重点就读为3
data.loc[data['学习成绩']=='差', '学习成绩'] = 0 #设定成绩差为0
data.loc[data['学习成绩']=='中', '学习成绩'] = 1 #设定成绩中等为1
data.loc[data['学习成绩']=='良', '学习成绩'] = 2 #设定成绩较好为2
data.loc[data['学习成绩']=='优', '学习成绩'] = 3 #设定成绩优秀为3

#data.sample(n, replace, weights, axis): n为要求抽取出来的样本集数量， replace要求是否有放回均匀分布， weights为对每个data的样本设定抽样概率（series格式），axis=0要求抽行样本。

def AdaBoost_model(data, n, k=40):
    data['xb'] = 1.0
    probability = pd.Series([1 / len(data)] * len(data), index=data.index) #放在循环外面，不然迭代抽样概率分布时重置了
    classification_point_list = []
    model_list = []
    alpha_list = []
    Y_classification_updata = pd.Series(np.zeros(len(data)))
    Updata_ErrorRate_list = []
    for i in np.arange(k):
        sampling_data = data.sample(n = len(data), replace=True, weights=probability, axis=0)
        X = sampling_data.drop(sampling_data.columns[n], axis=1).astype(float)
        Y = sampling_data.iloc[:, n].astype(float)
        #想了一想，用LR虽然也可以做分类，但是要在估计概率值上再次测试分类点，工具比较麻烦;后面可以调试换朴素贝叶斯/KNN/SVM试试
        #用LR被证明是错误的，因为LR的分类逻辑与决策树等分类器理念不同，刻意重视误分类样本只会导致模型崩溃，误差无限大，但是外网有存在Logitboost，所以比较困惑，后面有机会再启动修改。
        model = sm.Logit(Y, X) #拟合模型
        result = model.fit() #拟合模型
        Y_estimate = result.predict(X).astype(float) #根据拟合模型预测数据
        classification_dict = {}
        for a in np.arange(0.10, 1.00, 0.01): #按照0.10, 0.11, 0.12划分决策点寻找最优分类点
            classification_point = round(a, 2) #arange函数BUG，需要四舍五入保留2位小数点
            Y_classification = pd.Series(np.where(Y_estimate >= classification_point, 1, 0)) #根据划分点分类
            error_rate = (np.abs(Y - Y_classification)).sum() / float(len(Y)) #实际0-预测0=0，实际0-预测1=-1，实际1-预测0=1，实际1-预测1=0；因此Y-Y预测进行绝对值化求和得到预测错误样本比
            classification_dict[classification_point] = error_rate
        best_error_rate = classification_dict[min(classification_dict, key=classification_dict.get)] #选择最小误差率
        best_classification_point = min(classification_dict, key=classification_dict.get) #选择最小误差率对应决策点
#针对该误差率进行计算优化：
        if best_error_rate == 0.00: #不存在误差，终止再次迭代
            break
        else: #情况良好，误差率降低中
            classification_point_list.append(best_classification_point)
            model_list.append(result)
            alpha = 0.5 * np.log((1 - best_error_rate) / best_error_rate) #计算权重系数
            alpha_list.append(alpha)
            Y_classification = pd.Series(np.where(Y_estimate >= best_classification_point, 1, 0).astype(float)) #分类数据
            Y[Y==0.0] = -1.0
            Y_classification[Y_classification==0.0] = -1.0 #将0改为-1，方便后续计算
            H = pd.DataFrame(np.exp(-alpha * (Y * Y_classification))) #将本次迭代样本概率权重改为DataFrame格式
            H = H[H.index.duplicated()==False] #利用duplicated函数找出不重复索引并选择，完成剔除多个同一样本的抽样分布权重
            probability_list = pd.concat([probability, H], axis=1, join='inner') #内连接上一周期抽样分布概率，其中第1列是本次迭代抽样的样本概率，第2列是本次迭代抽样的抽样迭代权重
            sample_probability = (probability_list.iloc[:, 0] * probability_list.iloc[:, 1]) / (probability_list.iloc[:, 0] * probability_list.iloc[:, 1]).sum() #获得本次抽样样本的抽样分布概率
            for b in sample_probability.index:
                probability[b] = sample_probability[b] #将本次样本的迭代抽样概率更新入上次总体的抽样概率表
            probability = probability / probability.sum() #归一化总体抽样概率表
            Y_classification_updata =Y_classification_updata + alpha * Y_classification
            Updata_Y_classification = pd.Series(np.where(Y_classification_updata >= 0, 1, 0))
            Y[Y==-1.0] = 0.0
            Updata_error_rate = (np.abs(Y - Updata_Y_classification).sum()) / len(Y)
            Updata_ErrorRate_list.append(Updata_error_rate)

    return model_list, classification_point_list, alpha_list, Updata_ErrorRate_list #良好完成迭代，返回model集，分类点集，最终分类器分类误差率


def Predict(data, n, test, k=40):
    test['xb'] = 1.0
    model_list, classification_point_list, alpha_list, Updata_ErrorRate_list = AdaBoost_model(data, n, k)
    Y_classification_updata = pd.Series(np.zeros(len(data)))
    for i in np.arange(len(model_list)):
        test = test.astype(float)
        Y_elsimate = model_list[i].predict(test)
        Y_classification = pd.Series(np.where(Y_elsimate>=classification_point_list[i], 1.0, -1.0))
        Y_classification_updata = Y_classification_updata + alpha_list[i] * Y_classification
    Y_classification_finally = pd.Series(np.where(Y_classification_updata>=0, 1, 0.0))
    return Y_classification_finally
























# -*- coding: utf-8 -*-
import numpy as np
import pandas as pd
import scipy.stats as st
import matplotlib.pyplot as plt
import math as mt
import statsmodels.api as sm
import random as rd
from statsmodels.formula.api import ols
from statsmodels.stats.anova import anova_lm
from statsmodels.stats.multicomp import pairwise_tukeyhsd

#单因素方差分析
data = pd.read_excel(unicode(r'C:\Users\mime\Desktop\统计学学习数据.xlsx','utf-8'),sheetname=0)
list_value = []
list_variable = []
for i in arange(len(data.columns)):
    x = data.iloc[:,i]
    for value in x:
        list_value.append(value)
        list_variable.append(data.iloc[:,i].name)
data = pd.DataFrame([list_variable,list_value],index=['indestry','Y']).T
formula = 'Y ~ C(indestry)'
anova_results = anova_lm(ols(formula,data).fit())

mean_data = data.mean(axis=1)
k = len(data.index)
n = (data.count(axis = 1)).sum()
mean_all = ((data.sum(axis=1)).sum()) / ((data.count(axis=1)).sum())
SST = (((data - mean_all)**2).sum()).sum()
SSA = float((((mean_data-mean_all)**2).mul(data.count(axis = 1),axis=0)).sum())
SSE = ((data.sub(mean_data,axis=0)**2).sum(axis=1)).sum()
F = (SSA/(k-1)) / (SSE/(n-k))
F_pval = st.f.cdf(F,k-1,n-k)
F_alpha = st.f.ppf(1-0.05,k-1,n-k)
R_square = SSA / SST
R = mt.sqrt(SSA/SST) 


#根据LSD(Least Significant Difference)法来进行多重比较方法
def LSD(data,i,j,alpha=0.05):
    mean_i = data.iloc[i].mean()
    mean_j = data.iloc[j].mean()
    mean_error = abs(mean_i-mean_j)
    #print mean_error
    n = data.count(axis=1).sum()
    k = len(data.index)
    mean_data = data.mean(axis=1)
    SSE = ((data.sub(mean_data,axis=0)**2).sum(axis=1)).sum()
    MSE = SSE/(n-k)
    ni = data.count(axis=1)[i]
    nj = data.count(axis=1)[j]
    t = st.t.ppf(1-alpha/2,n-k)
    LSD = t * mt.sqrt(MSE*(1/float(ni)+1/float(nj)))#除法中的分母一定要进行浮点数化
    #print t,MSE,ni,nj,'\n%.7f' %LSD
    if mean_error > LSD:
        print u'mean_error > LSD is ',mean_error > LSD,':',data.iloc[i].name, u'与',data.iloc[j].name, u'两个水平之间存在显著差异'
    elif mean_error < LSD:        
        print u'mean_error > LSD is ',mean_error > LSD, ':',data.iloc[i].name, u'与',data.iloc[j].name, u'两个水平之间不存在显著差异'

        
                
                        
                                
                                                
#双因素方差分析
data = pd.read_excel(unicode(r'C:\Users\mime\Desktop\统计学学习数据.xlsx','utf-8'),sheetname=1)

#设定双因素因素独立方差分析函数
def two_way_ANOVA_independnt(data,alpha=0.05):
    mean_c = data.mean(axis=0)
    mean_r = data.mean(axis=1)
    mean_all = (data.sum().sum()) / float(data.count().sum())
    SST = (((data-mean_all)**2).sum()).sum()
    SSR = ((mean_r-mean_all)**2).mul(data.count(axis=1),axis=0).sum()   #计算行因素的误差平方和，需要将行均值-总均值的平方和乘以每行对应的样本数之后再合计
    SSC = ((mean_c-mean_all)**2).mul(data.count(axis=0),axis=0).sum()   #计算列因素的误差平方和，需要将列均值-总均值的平方和乘以每列对应的样本数之后再合计
    SSE = ((((data.sub(mean_r,axis=0)).sub(mean_c,axis=1)) + mean_all)**2).sum().sum()
    r = float(data.count(axis=0).unique())
    c = float(data.count(axis=1).unique())
    MST = SST/float(c*r-1)
    MSR = SSR/float(r-1)
    MSC = SSC/float(c-1)
    MSE = SSE/float((c-1)*(r-1))
    F_c = MSC/MSE
    F_r = MSR/MSE
    F_c_alpha = st.f.ppf(1-alpha,c-1,(c-1)*(r-1))
    F_r_alpha = st.f.ppf(1-alpha,r-1,(c-1)*(r-1))
    F_c_pval = st.f.cdf(F_c,c-1,(c-1)*(r-1))
    F_r_pval = st.f.cdf(F_r,r-1,(c-1)*(r-1))
    return pd.DataFrame([[SSR,r-1,MSR,F_r,F_r_alpha,F_r_pval],[SSC,c-1,MSC,F_c,F_c_alpha,F_c_pval],[SSE,(c-1)*(r-1),MSE]],index=['行因素','列因素','误差'],columns=['误差平方和SS','自由度df','均方MS','F值','临界值F','拒绝假设率'])
x = two_way_ANOVA_independnt(data)
R_square = x.iloc[0:2,0].sum() / x.iloc[:,0].sum()
R = mt.sqrt(x.iloc[0:2,0].sum() / x.iloc[:,0].sum())

data = data.unstack().reset_index()                   #关键点在于转化成一个分类指标、分来指标、数值型数据三列并排的数据结构
data.columns = ['location', 'brand', 'Y']             #对三列数据进行命名，方便操作
formula =  'Y~ location + brand'                      #设置格式 因变量 ~ 自变量 + 自变量
anova_results = anova_lm(ols(formula,data).fit())     #返回分析结构图，跟上图自建函数一致



data = pd.read_excel(unicode(r'C:\Users\mime\Desktop\统计学学习数据.xlsx','utf-8'),sheetname=2)

#双因素条件下因素互相有关联的情形：()
def two_way_ANOVA_(data,alpha=0.05):
    r = len(data.columns.unique()) #列因素包含的水平个数
    c = len(data.index.unique())   #行因素包含的水平个数
    m = len(data[data.index == data.index.unique()[0]].index) #行因素中每个水平里包含的样本数量
    mean_c = data.mean(axis=0)
    mean_r = pd.Series([data.mean(axis=1)[:m].mean(),data.mean(axis=1)[m:].mean()],index=['高峰期','非高峰期'])
    mean_cr = mean_rc = pd.DataFrame([[data.iloc[:m,0].mean(),data.iloc[:m,1].mean()],[data.iloc[m:,0].mean(),data.iloc[m:,1].mean()]],index=['高峰期','非高峰期'],columns=['路段1','路段2'])        
    mean_all = (data.sum().sum()) / float(data.count().sum())
    SST = (((data-mean_all)**2).sum()).sum()
    SSR = r*m*((mean_r-mean_all)**2).sum()   #计算行因素的误差平方和，需要将行均值-总均值的平方和乘以每行对应的样本数之后再合计
    SSC = c*m*((mean_c-mean_all)**2).sum()   #计算列因素的误差平方和，需要将列均值-总均值的平方和乘以每列对应的样本数之后再合计
    SSCR = SSRC = m*((np.array([np.array([np.array(mean_cr)[0]-np.array(mean_r)[0],np.array(mean_cr)[1]-np.array(mean_r)[1]]).T[0] - np.array(mean_c)[0],np.array([np.array(mean_cr)[0]-np.array(mean_r)[0],np.array(mean_cr)[1]-np.array(mean_r)[1]]).T[1] - np.array(mean_c)[1]]).T + mean_all)**2).sum()
    SSE = SST-SSR-SSC-SSCR
    MSR = SSR/float(c-1)
    MSC = SSC/float(r-1)
    MSE = SSE/float(c*r*(m-1))
    MSRC = MSCR = SSCR/float((r-1)*(c-1))
    F_c = MSC/MSE
    F_r = MSR/MSE
    F_rc = F_cr = MSRC/MSE
    F_c_alpha = st.f.ppf(1-alpha,r-1,c*r*(m-1))
    F_r_alpha = st.f.ppf(1-alpha,c-1,c*r*(m-1))
    F_rc_alpha = F_cr_alpha = st.f.ppf(1-alpha,(c-1)*(r-1),c*r*(m-1))
    F_c_pval = st.f.cdf(F_c,c-1,c*r*(m-1))
    F_r_pval = st.f.cdf(F_r,r-1,c*r*(m-1))
    F_rc_pval = F_cr_pval = st.f.cdf(F_rc,(c-1)*(r-1),c*r*(m-1))
    return pd.DataFrame([[SSR,r-1,MSR,F_r,F_r_alpha,F_r_pval],[SSC,c-1,MSC,F_c,F_c_alpha,F_c_pval],[SSRC,(c-1)*(r-1),MSRC,F_rc,F_cr_alpha,F_cr_pval],[SSE,c*r*(m-1),MSE]],index=['行因素','列因素','交互因素','误差'],columns=['误差平方和SS','自由度df','均方MS','F值','临界值F','拒绝假设率'])

data = data.unstack().reset_index()
data.columns = ['luduan','ifgaofengqi','Y']
formula = 'Y~C(luduan)+C(ifgaofengqi)+C(luduan):C(ifgaofengqi)'
anova_result = anova_lm(ols(formula,data).fit())
print anova_result




















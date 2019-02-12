# -*- coding: utf-8 -*-
import numpy as np
import pandas as pd
import scipy.stats as st
import matplotlib.pyplot as plt
import math as mt
import statsmodels.api as sm

data = pd.read_excel(unicode(r'C:\Users\mime\Desktop\统计学学习数据.xlsx','utf-8'),sheetname=3)
data.set_index(u'分行编号',inplace=True)
data1 = data.rename(index=str,columns={u'不良贷款':'no_performing loan',u'各项贷款余额':'loan balance',u'本年累计应收贷款':'accumulative receivable loan',u'贷款项目个数':'loan project amount',u'本年固定资产投资额':'fixed investments'})
X = data1[['loan balance','accumulative receivable loan','loan project amount','fixed investments']]
Y = data1['no_performing loan']
X = sm.add_constant(X)
result = sm.OLS(Y,X).fit()
result.summary()
result.params

def model(x1,x2,x3,x4):
    return result.params[0] + result.params[1]*x1 + result.params[2]*x2 + result.params[3]*x3 + result.params[4]*x4

Y_value = model(data1['loan balance'],data1['accumulative receivable loan'],data1['loan project amount'],data1['fixed investments'])

SSR = ((Y_value-Y.mean())**2).sum()
SSE = ((Y-Y_value)**2).sum()
SST = ((Y-Y.mean())**2).sum()

ADJ_R_squared = 1-(1-SSR/SST)*((len(data1.index)-1)/(len(data1.index)-len(X.columns)-1.0))
Se = mt.sqrt(SSE/(len(data1.index)-4.0-1.0))
F = (SSR/4.0)/(SSE/(len(X.index)-4.0-1.0))

f = lambda x : abs(x) * ((23.0 / (1-x**2))**0.5)  #mt.sqrt()函数只适合单个数值，无法处理数组形式

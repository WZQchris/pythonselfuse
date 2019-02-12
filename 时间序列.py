# -*- coding: utf-8 -*-
import numpy as np
import pandas as pd
import numpy as np
import pandas as pd
import scipy.stats as st
import matplotlib.pyplot as plt
import math as mt
import statsmodels.api as sm

data = pd.read_excel(unicode(r'C:\Users\mime\Desktop\统计学学习数据.xlsx','utf-8'),sheetname=1)


#通过作图观察是否存在任何成分变化
fig = plt.figure()    
ax1 = fig.add_subplot(2,2,1)
ax2 = fig.add_subplot(2,2,2)
ax3 = fig.add_subplot(2,2,3)
ax4 = fig.add_subplot(2,2,4)
from matplotlib.font_manager import FontProperties
font_set = FontProperties(fname=r'C:\Windows\Fonts\simsun.ttc',size=12) 
ax1.plot(data[u'年份'],data[u'啤酒产量'],linestyle='dashed',color='cyan',marker='x')
ax1.set_xlabel(u'年份',fontproperties=font_set)
ax1.set_ylabel(u'啤酒产量',fontproperties=font_set)
ax1.set_xticks(list(data[u'年份']))

ax2.plot(data[u'年份'],data[u'人均GDP'],linestyle='dashed',color='orangered',marker='.')
ax2.set_xlabel(u'年份',fontproperties=font_set)
ax2.set_ylabel(u'人均GDP',fontproperties=font_set)
ax2.set_xticks(list(data[u'年份']))

ax3.plot(data[u'年份'],data[u'煤炭占能源消费总量的比重'],linestyle='dashed',color='deeppink',marker='o')
ax3.set_xlabel(u'年份',fontproperties=font_set)
ax3.set_ylabel(u'煤炭占能源消费总量的比重',fontproperties=font_set)
ax3.set_xticks(list(data[u'年份']))

ax4.plot(data[u'年份'],data[u'居民消费价格指数'],linestyle='dashed',color='gray',marker='s')
ax4.set_xlabel(u'年份',fontproperties=font_set)
ax4.set_ylabel(u'居民消费价格指数',fontproperties=font_set)
ax4.set_xticks(list(data[u'年份']))

#通过描述性语言描述数据表现
data.pct_change()

def avg_grow_rate(data):  #计算平均增长函数
    return pd.Series([(pow(i,1/float(len(data.index)-1))-1.0) for i in (data.loc[data.index.max()] / data.loc[0])],index=data.columns)

def predict_value(data):  #通过平均增长函数来预测下一时间数值
    return data.loc[data.index.max()].mul((avg_grow_rate(data)+1)**2)

#选择预测方法
#无趋势、无季节波动的平稳序列的预测：
#1.简单平均法：
def simple_avg(data):
    return [data[:i].mean() for i in data.index] 
#2.移动平均法
def moving_avg(data,k):
    moving_avg = []
    for i in data.index:
        if i<k:
            moving_avg.append(np.NaN)
        else:
            moving_avg.append(data[i-k:i].mean())
    return moving_avg
#3.指数平滑法
def exp_smh(data,alpha):
    exp_smh = pd.Series(index=data.index)
    i = 0
    x = data[i]
    while i <  len(data.index):
        i = i+1
        x = alpha*data[i-1] + (1-alpha)*x
        exp_smh[i] = x
    return exp_smh

#指数曲线的拟合
import scipy.optimize as so
def func(x,a,b):
    return a*pow(b,x)
#假设数据符合该模型，可以通过取对数化后大致拟合线性，再取反对数获得原模型或者预测值
year = np.array(data[u'年份'])
gdp = np.array(data[u'人均GDP'])
#popt, pcov = so.curve_fit(func, year, gdp)
#yval = func(year,popt[0],popt[1])
log_gdp = np.log(gdp) 
model = sm.OLS(log_gdp,sm.add_constant(year)).fit()


#data_GDP = data[[u'年份',u'人均GDP']].set_index(u'年份',inplace=True)
#import statsmodels.tsa as sttsa
#from datetime import datetime
#dates = pd.date_range('12/31/2000',freq='A-DEC',periods=14)
#data_time_GDP = data[u'人均GDP']
#data_time_GDP.index = dates
#model_tsa = sttsa.ar_model.AR(data_time_GDP).fit()
#cycle,trend = sm.tsa.filters.hpfilter(data_time_GDP)

fig = plt.figure(figsize=(12,8))
ax = fig.add_subplot(111)
ax.plot(data[u'年份'],data[u'人均GDP'],linestyle='dashed',color='orangered',marker='.',label=u'')
ax.plot(data[u'年份'],trend,linestyle='solid',color='springgreen')
ax.plot(data[u'年份'],yval,linestyle='dashed',color='magenta')
ax.plot(data[u'年份'],np.exp(model.predict()),linestyle='dashed',color='magenta')


#多阶多项式拟合
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
year = np.array(data[u'年份']).reshape(len(data[u'年份']),1)
energy = np.array(data[u'煤炭占能源消费总量的比重'])
poly_degree = PolynomialFeatures(degree=2)
X_yaer = poly_degree.fit_transform(year)
poly_linear_model = LinearRegression()
poly_linear_model.fit(X_yaer,energy)
yvalues = poly_linear_model.predict(X_yaer)

fig = plt.figure(figsize=(12,8))
ax = fig.add_subplot(111)
ax.plot(data[u'年份'],data[u'煤炭占能源消费总量的比重'],linestyle='dashed',color='deeppink',marker='o')
ax.plot(data[u'年份'],yvalues,linestyle='solid',color='springgreen',marker='o')



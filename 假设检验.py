# -*- coding: utf-8 -*-
import numpy as np
import pandas as pd
import scipy.stats as st
import matplotlib.pyplot as plt
import math as mt
import statsmodels as sm


np.set_printoptions(suppress=True)
def z_fun(x,u,a,n):
    b = (x-u) / (a/mt.sqrt(n))
    return b
    
(59.34-49.16) / mt.sqrt((mt.pow(20,2)/60) + (mt.pow(18,2)/60))
def u_u(mean1,mean2,std1,std2,n1,n2,u1=0,u2=0):
    return (mean1-mean2-(u1-u2))/((mt.sqrt(((n1-1)*mt.pow(std1,2)+(n2-1)*mt.pow(std2,2))
    /(n1+n2-2)))*(mt.sqrt(1/n1+1/n2)))


data = np.array([252,346,260,332,312,340,290,242,328,310,
298,316,310,346,274,306,370,346,350,160,
310,370,328,280,312,380,374,294,358,298,
370,346,294,330,298,348,322,306,340,268,
334,250,296,290,460,278,334,250,330,364])

def fun(x):
    #return (x - 316) / 46.55


 for i in arange(0,6):
    if i == 0:
        print  'ERROR'
    else:
        x = a[i] - a[i-1]
        pct.append(x)
        

def COC(X,n,a=1):
    print u'PHI 相关系数 : %.6f \n' %mt.sqrt(X/n)
    print u'V 相关系数 : %.6f \n' %mt.sqrt(X/(n*a))
    print 'coefficient of contingency : %.6f \n'%mt.sqrt(X/(X+n))



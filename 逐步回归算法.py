# -*- coding: utf-8 -*-
import numpy as np
import pandas as pd
import scipy.stats as st
import matplotlib.pyplot as plt
import math as mt
import statsmodels.api as sm
import random as rd

data = pd.read_excel(unicode(r'C:\Users\mime\Desktop\统计学学习数据.xlsx','utf-8'),sheetname=3)
data.set_index(u'分行编号',inplace=True)
data1 = data.rename(index=str,columns={u'不良贷款':'no_performing loan',u'各项贷款余额':'loan balance',u'本年累计应收贷款':'accumulative receivable loan',u'贷款项目个数':'loan project amount',u'本年固定资产投资额':'fixed investments'})
variables_data = data1[['loan balance','accumulative receivable loan','loan project amount','fixed investments']]
Y = data1['no_performing loan']


def stepwise_regression(variables_data,Y,alpha=0.05):
#向前选择法
    model_all = sm.OLS(Y,sm.add_constant(variables_data)).fit()
    variable_list = []
    loop = True
    while loop==True:
        variables = list(set(variables_data.columns)-set(variable_list))
        new_P_F = pd.DataFrame(index=variables,columns=['pval','fval','SSEval'])
        for variable in variables:
            fval_max_var = variable_list[:]
            fval_max_var.append(variable)
            X = variables_data[fval_max_var]
            X = sm.add_constant(X)
            model = sm.OLS(Y,X).fit()    
            fitted_Y = model.predict()
            SSR = ((fitted_Y-Y.mean())**2).sum()
            SSE = ((Y-fitted_Y)**2).sum()
            SST = ((Y-Y.mean())**2).sum()
            k = len(X.columns)
            F = (SSR/k) / (SSE/(len(data1.index)-k-1))
            new_P_F.loc[variable,'pval'] = '{:.10f}'.format(model.pvalues[variable])
            new_P_F.loc[variable,'fval'] = F
            new_P_F.loc[variable,'SSEval'] = SSE
        fval_max = new_P_F['fval'].max()
        if fval_max > st.f.ppf(1-alpha,k,len(data1.index)-k-1):#通过显著性检验
            fval_max_var = new_P_F[new_P_F['fval']==fval_max].index.tolist()
            variable_list.append(fval_max_var[0])
            variable_list_temporary = variable_list[:]
#开始尝试进行向后剔除法，去掉任意一个变量后的回归模型的SSR最大值，也就是去掉的变量的偏SSR最小，并对该变量进行显著性检验，若不显著即<临界值，确认需要剔除该变量        
            if len(variable_list) >= 3:  #可用变量数量在3个以上时
                new_P_SSR = pd.DataFrame(index=variables,columns=['SSRval'])
                for variable in variable_list:
                    variable_temporary = variable_list[:]
                    variable_temporary.remove(variable)
                    X_little = variables_data[variable_temporary]
                    X_little = sm.add_constant(X_little)
                    model_little = sm.OLS(Y,X).fit() 
                    fitted_Y_little = model_little.predict()
                    SSR_little = ((fitted_Y_little-Y.mean())**2).sum()
                    SSE_little = ((Y-fitted_Y_little)**2).sum()
                    SST_little = ((Y-Y.mean())**2).sum()
                    k_little = len(X_little.columns)
                    F_little = (SSR/k) / (SSE/(len(data1.index)-k-1))
                    new_P_SSR.loc[variable,'SSRval'] = SSR_little
                ssrval_max = new_P_SSR.max()
                elimination_variable = new_P_SSR[new_P_SSR == ssrval_max].index.tolist()
                if model_all.t_test(elimination_variable).tvalue.tolist()[0] < st.t.ppf(1-alpha,len(data1.index)-2): #假设剔除变量进行T检验
                    variable_list_temporary.remove(fval_max_var[0])
                    if variable_temporary == variable_list_temporary:
                        loop = False
                        variable_list = variable_temporary[:] 
                        print 'this is finally variable list :%s'%variable_list
                else:
                    loop = False
                    print variable_list            
        else:
            loop = False
            print variable_list
        

                

                    
                            
                            
                            
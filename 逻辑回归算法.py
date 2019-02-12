# -*- coding: utf-8 -*-
#logistic regression 
import numpy as np
import pandas as pd
import numpy as np
import pandas as pd
import scipy.stats as st
import matplotlib.pyplot as plt
import math as mt
import statsmodels.api as sm

#设置数据集
man_score = np.random.normal(loc=85.045, scale=3.932, size=550) # 男性分数
woman_score = np.random.normal(loc=81.996, scale=4.135, size=450) #女性分数
score = np.append(man_score,woman_score)
data = pd.DataFrame(columns=['GENDER','KEYSCH','SCORE','ISCOLLEGE'])
data['SCORE'] = score

data.loc[:549,'GENDER'] = 1 #男性设置哑边量1
data.loc[550:,'GENDER'] = 0 #女性设置哑边量0

data.loc[17:50,'KEYSCH'] = 1 #重点中学设置哑变量0
data.loc[200:240,'KEYSCH'] = 1
data.loc[644:700,'KEYSCH'] = 1
data['KEYSCH'][data['KEYSCH']!=1] = 0  #非重点中学设置哑变量0

data.loc[:220,'ISCOLLEGE'] = 1     #设置男生进入高校哑变量1
data.loc[300:339,'ISCOLLEGE'] = 1
data.loc[671:678,'ISCOLLEGE'] = 1  #设置女生进入高校哑变量1
data.loc[915:980,'ISCOLLEGE'] = 1
data['ISCOLLEGE'][data['ISCOLLEGE']!=1] = 0 #设置未进入高校哑变量0
data = data.astype(float)

X = data.iloc[:,:3]
Y = data['ISCOLLEGE']
X = sm.add_constant(X)
model = sm.Logit(Y,X)  #不太清楚，但是后续可以在跟进问下，有两个方面猜想1.我的哑变量需要转为浮点数，2:我的X跟Y可能都是DataFrame格式
result = model.fit()
print result.summary()

#测试集检验
import copy
test = copy.deepcopy(data)
X_test = test.iloc[:,:3]
X_test = sm.add_constant(X_test)
Y_estimate = result.predict(X_test.astype(float))  #为什么又需要改变格式，后续请教大神
Y_estimate = pd.DataFrame(Y_estimate)
test_result = pd.merge(X_test,Y_estimate,right_index=True,left_index=True)
test_result.columns = ['const','GENDER', 'KEYSCH', 'SCORE', 'ISCOLLEGE']
data_cross = pd.crosstab([data['KEYSCH'],data['GENDER']],data['ISCOLLEGE'])
test_cross = pd.crosstab([test_result['KEYSCH'],test_result['GENDER']],data['ISCOLLEGE'])

#----Logit回归的godness of fit---
#卡方检验
c = 2*2
k = 3
chi = result.resid_pearson.sum()
st.chi2.ppf(1-0.05,c-k)#c表示协变量即GENDER与KEYSCH与SCORE的层次化索引的个数，即len(GENDER)*len(KEYSCH)*len(SCORE)；K表示参数数目个数
#deviance检验
deviance = result.resid_dev.sum()
st.chi2.ppf(1-0.05,c-k)
#Hosmer-Lemeshow检验
bins = [0.00, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70]
cut_test = pd.cut(test_result['ISCOLLEGE'],bins,right=True)
cut_test = pd.DataFrame(cut_test)
observe = pd.DataFrame(data['ISCOLLEGE'])
HL_value = pd.merge(observe,cut_test,right_index=True,left_index=True)
HL_value = pd.merge(HL_value,Y_estimate,right_index=True,left_index=True)
HL_value.columns = ['observe','bins','estimate']
grouped = HL_value.groupby(['bins','observe'])
estimate = pd.DataFrame(grouped['estimate'].mean())
observe = pd.DataFrame(grouped['observe'].count())
observe_1 = observe.unstack(1).iloc[:,1]
n = observe.unstack(1).sum(axis=1)
estimate = estimate.unstack(1).iloc[:,1]
HL = ((observe_1 - estimate * n) / ((estimate * (1-estimate)) * n)).sum()
st.chi2.ppf(1-0.05,(len(bins)-1)-2)

#---Logit回归的预测准确性----
#类R^2指标（Analogous R square）
R_square = result.summary()  # 其中的Pseudo R-squ.:就是类R^2
#序次相关指标（Rank Correlation Index）
data_compare = pd.merge(Y_estimate,pd.DataFrame(data['ISCOLLEGE']),right_index=True,left_index=True)
data_compare.columns = ['estimate','observe']
data_compare_1 = data_compare[data_compare['observe']==1].reset_index()
data_compare_0 = data_compare[data_compare['observe']==0].reset_index()
concordant,disconcordant,tie = 0, 0, 0
for i in arange(665):     #ISCOLLEGE==0的循环次数
    for j in arange(335): #ISCOLLEGE==1的循环次数
        if data_compare_1.iloc[j,1] > data_compare_0.iloc[i,1]:
            concordant = concordant + 1
        elif data_compare_1.iloc[j,1] < data_compare_0.iloc[i,1]:
            disconcordant = disconcordant +1
        else:
            tie = tie + 1
concordant_rate = concordant / float(concordant + disconcordant + tie)
disconcordant_rate = disconcordant / float(concordant + disconcordant + tie)
tie_rate = tie / float(concordant + disconcordant + tie)
#分类表 设定阈值为0.5
data_compare['y_estimate'] = 0
data_compare['y_estimate'][data_compare['estimate'] > 0.5] = 1
pd.crosstab(data_compare['observe'],data_compare['y_estimate'],margins=True)

#---Logit回归的最大似然比的卡方统计量---
result.llr


#---Logit回归系数的解释---
#1.wald检验
result.wald_test(X.columns)
#2.likelihood ratio检验
X_test_LR = data.iloc[:,:2]                                     #剔除‘scroe’自变量
score_LR = result.llf - sm.Logit(Y.astype(float),X_test_LR.astype(float)).fit().llf         #计算score的似然比检验


def stepwise_regression(Y,X,alpha1=0.05,alpha2=0.05):
    Y = Y.astype(float)   
    loop = True
    variable_list = []
    variable_used = []
    
    while loop == True:
        if len(variable_list) >= 3:          # 有三个及以上的变量时需要做向后剔除
            LLR_tab = pd.Series(index=variable_list,columns='LLR')
            for variable in variable_list:
                varlist_tem2 = variable_list[:]
                varlist_tem2.remove(variable)
                varlist_tem_data = X[varlist_tem2]
                varlist_tem_data = (sm.add_constant(varlist_tem_data)).astype(float)
                model_backstep = sm.Logit(Y,varlist_tem_data)
                result_backstep = model_backstep.fit()
                model_all = sm.Logit(Y,sm.add_constant(X[variable_list]).astype(float))
                result_all = model_all.fit()
                variable_llr = result_backstep.llr - result_all.llr   #求得每个拟剔除变量的似然比值
                LLR_tab[variable] = variable_llr
            min_llr =  LLR_tab.min() 
            if min_llr < st.chi2.ppf(1-alpha2,1):                     #最小的似然比值都<临界值，说明这个对应变量约束条件成立，该变量不显著，无须在这个模型中选择该变量
                eliminate_variable = LLR_tab[LLR_tab==min_llr].index.tolist()
                varlist_tem2 = variable_list[:]
                varlist_tem2.remove(eliminate_variable)
                if varlist_tem1 != varlist_tem2:
                    variable_list.remove(eliminate_variable)
                else:
                    loop = False
        else:        
            variable_notuse = list(set(X.columns)-set(variable_used)) #该次选择的变量固定在未使用的变量内
            varlist_tem1 = []
            LLR_tab = pd.Series(index=variable_notuse,columns='LLR')
            for variable in variable_notuse:
                varlist_tem1 = variable_list[:]  #先获得当前已确定使用的变量
                varlist_tem1.append(variable)    #本轮的各个变量分别加入已使用的变量表中测试
                varlist_tem_data = X[varlist_tem1]
                varlist_tem_data = (sm.add_constant(varlist_tem_data)).astype(float)
                model = sm.Logit(Y,varlist_tem_data)
                result = model.fit()            #极大似然估计拟合
                LLR = result.llr
                LLR_tab[variable] = LLR
            max_llr = LLR_tab.max()      #选择最大的极大似然比值
            if max_llr > st.chi2.ppf(1-alpha1,len(variable_notuse)): #该最大似然比值大于临界值，模型显著
                selected_variable = LLR_tab[LLR_tab==max_llr].index.tolist()
                varlist_tem1 = variable_list[:]
                varlist_tem1.append(selected_variable)
                test_data = X[varlist_tem1]
                test_data = sm.add_constant(test_data)
                model_test = sm.Logit(Y,test_data.astype(float))
                result_test = model_test.fit()
                score_max = (model_test.score(result_test.params)).max()
                if score_max < alpha1:              #添加该变量后的模型所有的回归系数都显著
                    variable_list.append(selected_variable)
                    variable_used.append(selected_variable)
                else:                               #模型中存在不显著回归系数，说明模型错误，没有合适的变量可添加，终止变量选择
                    loop = False
            else:                                                   #最大的极大似然比都不显著，说明没有合适的变量可添加，终止变量选择
                loop = False
    return variable_list




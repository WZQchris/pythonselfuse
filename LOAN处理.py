# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import sys
sys.path.append(r'E:\python\pythonselfuse')
import Model_Evaluation_Index as mei

data = pd.read_csv(r"C:\Users\wuzhiqiang\Desktop\loan.csv")
# columns_dict = {}
# for i in range(len(data.columns)):
#     columns_dict[data.columns[i]] = i
"""{'id': 0, 'member_id': 1, 'loan_amnt': 2, 'funded_amnt': 3, 'funded_amnt_inv': 4, 'term': 5, 'int_rate': 6, 'installm1ent': 7, 'grade': 8, 'sub_grade': 9,
 'emp_title': 10, 'emp_length': 11, 'home_ownership': 12, 'annual_inc': 13, 'verification_status': 14, 'issue_d': 15, 'loan_status': 16, 'pymnt_plan': 17,
 'url': 18, 'desc': 19, 'purpose': 20, 'title': 21, 'zip_code': 22, 'addr_state': 23, 'dti': 24, 'delinq_2yrs': 25, 'earliest_cr_line': 26, 
 'inq_last_6mths': 27, 'mths_since_last_delinq': 28, 'mths_since_last_record': 29, 'open_acc': 30, 'pub_rec': 31, 'revol_bal': 32, 'revol_util': 33, 
 'total_acc': 34, 'initial_list_status': 35, 'out_prncp': 36, 'out_prncp_inv': 37, 'total_pymnt': 38, 'total_pymnt_inv': 39, 'total_rec_prncp': 40, 
 'total_rec_int': 41, 'total_rec_late_fee': 42, 'recoveries': 43, 'collection_recovery_fee': 44, 'last_pymnt_d': 45, 'last_pymnt_amnt': 46,
 'next_pymnt_d': 47, 'last_credit_pull_d': 48, 'collections_12_mths_ex_med': 49, 'mths_since_last_major_derog': 50, 'policy_code': 51,
 'application_type': 52, 'annual_inc_joint': 53, 'dti_joint': 54, 'verification_status_joint': 55, 'acc_now_delinq': 56, 'tot_coll_amt': 57, 
 'tot_cur_bal': 58, 'open_acc_6m': 59, 'open_il_6m': 60, 'open_il_12m': 61, 'open_il_24m': 62, 'mths_since_rcnt_il': 63, 'total_bal_il': 64, 
 'il_util': 65, 'open_rv_12m': 66, 'open_rv_24m': 67, 'max_bal_bc': 68, 'all_util': 69, 'total_rev_hi_lim': 70, 'inq_fi': 71, 'total_cu_tl': 72,
 'inq_last_12m': 73}
"""
# id， member_id 都是代指客户名称，无意义，删除。 loan_amnt, funded_amnt, funded_amnt_inv分别为申请金额，批复金额，放款金额，按放款金额为准，剔除前二者。
# term的IV值为0.00924，信息增益0.000764, 相关系数0.03975， 对于样本的鉴定效果并不佳，予以剔除。


#data.drop([u'id', u'member_id', u'loan_amnt', u'funded_amnt', u'emp_title', u'url', u'desc', u'title', u'zip_code', u'dit', u'earliest_cr_line', u'revol_util', u'initial_list_status', 
# u'pymnt_plan', u'out_prncp', u'out_prncp_inv', u'total_pymnt', u'total_pymnt_inv', u'total_rec_prncp', u'total_rec_int', u'total_rec_late_fee', u'recoveries',
# u'collection_recovery_fee', u'mths_since_last_major_derog', u'policy_code', u'annual_inc', u'verification_status', u'tot_coll_amt', u'tot_cur_bal',
# u'open_acc_6m', u'open_il_6m', u'open_il_12m', u'open_il_24m', u'mths_since_rcnt_il', u'total_bal_il', u'il_util', u'open_rv_12m', u'open_rv_24m', 
# u'max_bal_bc', u'all_util', u'total_rev_hi_lim', u'inq_fi', u'total_cu_tl', u'inq_last_12m'], axis=1, inplace=True)


def DefValues(data, n):
    dicts = {}
    x = data[data.columns[n]].unique()
    for i in range(len(x)):
        dicts[i] = x[i]
        data.loc[data[data.columns[n]] == x[i], data.columns[n]] = i
            
    return dicts

#1代表负样本， 0是正样本， 剔除Issued状态样本
data[data.columns[16]].replace({'Fully Paid':0, 'Current':0, 'Does not meet the credit policy. Status:Fully Paid':0, 
'Charged Off':1, 'Default':1, 'Late (31-120 days)':1, 'Late (16-30 days)':1, 
'In Grace Period':1, 'Does not meet the credit policy. Status:Charged Off':1}, inplace=True)
data.drop(data.loc[data[data.columns[16]] == 'Issued', :].index, axis=0, inplace=True)

#把州申请人数<1000的州进行合并计入others
stats_index = data.groupby([data.columns[23], data.columns[16]])[data.columns[16]].count().unstack(1).sum(1)[data.groupby([data.columns[23], data.columns[16]])[data.columns[16]].count().unstack(1).sum(1) <= 1000].index.tolist()
for i in stats_index:
    data[data.columns[23]] = data[data.columns[23]].str.replace(i, 'others')
state_dict = DefValues(data, 23)

#把近两年m1+次数>10的计入10, 因存在nan值，说明当前时间是在本次借款之前，故nan值为该客户无发生信贷记录，因此需为0
data.loc[data[data.columns[25]] > 10, data.columns[25]] = 10
data[data.columns[25]] = data[data.columns[25]].fillna(0.0)

#根据earliest_cr_line设计授信历史变量, 因earliest_cr_line存在客户无授信记录，存在NaT值，故credit_length存在nan值，填充为0值
data[data.columns[15]] = pd.to_datetime(data[data.columns[15]], format="%b-%Y") #贷款发放月份格式化
data[data.columns[26]] = pd.to_datetime(data[data.columns[26]], format="%b-%Y") #最早授信时间格式化
data["credit_length"] = [(i.days) / 30.0 for i in (data[data.columns[15]] - data[data.columns[26]])].fillna(0.0)

#inq_last_6mths为近半年内贷款申请次数，因存在客户无授信记录，存在nan值，故需要填充为0
data[data.columns[27]] = data[data.columns[27]].fillna(0.0)

#对上次违约时间/上次政府记录时间变量填充nan值, 因nan值意思为customer无历史不良记录，按照矩阵值理念，该数值越大说明customer不良记录越久远，对客户影响越低，故对无记录customer赋值为更大值
data[data.columns[28]] = data[data.columns[28]].fillna(data[data.columns[28]].max() + 100)
data[data.columns[29]] = data[data.columns[29]].fillna(data[data.columns[29]].max() + 100)

#open_acc为尚未完结贷款数,因存在nan值，说明当前时间是在本次借款之前，故nan值为该客户无发生信贷记录，因此需为0
data[data.columns[30]] = data[data.columns[30]].fillna(0.0)

#对公共负面记录次数中的nan值填充，无记录应为0.0
data[data.columns[31]] = data[data.columns[31]].fillna(0.0)

#对于revol_bal变量而言，最大值与最小值差过大可能存在计算要求过高，需要进行离散化，原则上低金额分级予以细化，高金额分级粗放

#total_acc为累计发生信贷次数，因存在nan值，说明当前时间是在本次借款之前，故nan值为该客户无发生信贷记录，因此需为0
data[data.columns[34]] = data[data.columns[34]].fillna(0.0)

#annual_inc_joint 为合计总收入，因 application_type == INDIVIDUAL 时，annual_inc_joint 值为 nan，将annual_inc中的值赋值进入annual_inc_joint中，并删掉annual_inc
data.loc[np.isnan(data[data.columns[53]]), data.columns[53]] = data.loc[np.isnan(data[data.columns[53]]), data.columns[13]]

#dti_joint 为合计还款收入比，nan值情况同annual_inc_joint，处理同上
data.loc[np.isnan(data[data.columns[54]]), data.columns[54]] = data.loc[np.isnan(data[data.columns[54]]), data.columns[24]]

#verification_status_joint 为收入真实确认状态， nan值同annual_inc_joint， 处理同上
for i in data[data.columns[55]]:
    if type(i) == float:
        data.loc[i.index, data.columns[55]] = data.loc[i.index, data.columns[14]]

#acc_now_delinq 为当前逾期账户数, 因nan值为无授信记录，予以填充0
data[data.columns[56]] = data[data.columns[56]].fillna(0.0)

term_dict = DefValues(data, 5)
grade_dict = DefValues(data, 8)
sub_grade_dict = DefValues(data, 9)
emp_length_dict = DefValues(data, 11)
home_ownership_dict = DefValues(data, 12)
purpose_dict = DefValues(data, 20)
application_dict = DefValues(data, 52)
verification_dict = DefValues(data, 55)
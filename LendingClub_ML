"""
@Version: 1.3.2
@Author: 吴智强
@Time: 2019-06-12 17:14
"""
import re, multiprocessing, os, random
import pandas as pd
import numpy as np
import datetime as dt
from sklearn.linear_model import LogisticRegression
from sklearn.decomposition import PCA
from sklearn.ensemble import GradientBoostingClassifier
import matplotlib.pyplot as plt
import seaborn as sns
from minepy import MINE
import xgboost as xgb

def func(x):
    if x.strip() in ['Current', 'Fully Paid', 'Does not meet the credit policy. Status:Fully Paid']:
        return 0
    elif x.strip() in ["Charged Off", "Late (31-120 days)", "In Grace Period", "Late (16-30 days)", "Does not meet the credit policy. Status:Charged Off", "Default"]:
        return 1

# 对于其他高空值率的字段做下分析，对于强金融属性的字段，空值尝试单独一类，离散化测试效果
def merge_SmallSimple(data, column_name, threshold=50):
    l = list(data[column_name].value_counts()[data[column_name].value_counts() <= threshold].index)
    value = "/".join(list(map(str, l)))
    data[column_name] = data[column_name].map(lambda x: value if x in l else x)

# 输入特征-因变量矩阵， 特征矩阵， 总信息熵，获得信息增益率
def gain_Ratio_Calculation(x_y_grouped, x_grouped, all_Entropy):
    condition_Entropy = x_y_grouped.div(x_y_grouped.sum(1), axis=0).mul(np.log2(x_y_grouped.div(x_y_grouped.sum(1), axis=0)),axis=0).sum(1).mul(x_y_grouped.sum(1) / x_y_grouped.sum(1).sum()).sum()
    split_Info = -x_grouped.mul(np.log2(x_grouped), axis=0).sum()
    gain_Ratio = (all_Entropy - condition_Entropy) / split_Info
    return gain_Ratio

# 连续型/高离散型变量离散化核心函数，其核心院里在于利用信息增益率，其值越大，说明分母越小表示的该变量此次划分自身纯净度越高，分子越大表示信息增益越大，此次划分让该变量对因变量的影响最佳
def search_Gain_Ratios(data, column_name, y_name, type_list, all_Entropy):
    gain_Ratios_dict = {}
    for i in type_list:
        test = data.copy()
        test[column_name] = test[column_name].map(lambda x: "a" if x == i else "b")
        x_y_grouped = test.groupby([column_name, y_name])[y_name].count().unstack(1)
        x_grouped = test[column_name].value_counts() / len(test[column_name])
        gain_Ratio = gain_Ratio_Calculation(x_y_grouped=x_y_grouped, x_grouped=x_grouped, all_Entropy=all_Entropy)
        gain_Ratios_dict[i] = gain_Ratio
    return gain_Ratios_dict

# 对于值较少且各样本足够的情况下,计算每个类别的条件信息熵，然后找出与类最接近的一类，将其赋值
def merge_By_gain_Ratio(data, column_name, y_name):
    condition_Entropy_dict = {}
    for i in data[column_name].unique():
        test = data.copy()
        test = test[test[column_name] == column_name]
        x_y_grouped = test.groupby([column_name, y_name])[y_name].count().unstack(y_name)
        conditon_Entropy = -x_y_grouped.div(x_y_grouped.sum(1), axis=0).mul(np.log2(x_y_grouped.div(x_y_grouped.sum(1), axis=0)),axis=0).sum(1).mul(x_y_grouped.sum(1) / x_y_grouped.sum(1).sum()).sum()
        condition_Entropy_dict[i] = conditon_Entropy
    for i in condition_Entropy_dict.keys():
        if i != "Unknow":
            condition_Entropy_dict[i] = abs(condition_Entropy_dict.get("Unknow") - condition_Entropy_dict.get(i))
    condition_Entropy_dict.pop("Unknow")
    most_Closed_type = max(zip(condition_Entropy_dict.values(), condition_Entropy_dict.keys()))[1]
    data[column_name] = data[column_name].map(lambda x: most_Closed_type if x == "Unknow" else x)
    return data[column_name]

# 函数思路：
# 是否划分点足够 <---------------|
#       |                      |
#       |不够                   |
#       |                      |
# 多进程寻找本次总体的最佳划分点   |
# 保存至输出list                 |
# 对总体进行切割 ----------------|
def split_points(data, column_name, y_name="loan_status", points_count=10):
    # 对于返回的划分点，进行划分
    def split_Data(data, column_name, points_List):
        temp_data = data.copy()
        def func(data, column_name, i):
            data[column_name] = data[column_name].map(lambda x: i if x == i else x)

        map(lambda y: func(data=temp_data, column_name=column_name, i=y), points_List)
        temp_data[column_name] = temp_data[column_name].map(lambda x: "Others" if x not in points_List else x)

        return temp_data[column_name]

    times, points_list = 0, []
    temp_data = data.copy()
    while times < points_count:
        y_counts = temp_data.groupby(y_name)[y_name].count() / float(len(temp_data))
        all_Entropy = -y_counts.mul(np.log2(y_counts), axis=0).sum()
        core = os.cpu_count()
        pool, gain_Ratios_dict = multiprocessing.Pool(processes=int(core)), {}
        type_value = list(temp_data[column_name].unique())
        number = int(len(type_value) / int(core))
        results = []
        for i in range(int(core)):
            if i == 0:
                type_list = type_value[:(number * (i + 1) + 1)]
            elif i != (int(core) - 1):
                type_list = type_value[(number * i + 1):(number * (i + 1) + 1)]
            elif i == (int(core) - 1):
                type_list = type_value[(number * (i + 1) + 1):]
            results.append(pool.apply_async(search_Gain_Ratios, (temp_data, column_name, y_name, type_list, all_Entropy, )))
        pool.close()
        pool.join()
        for i in results:
            gain_Ratios_dict.update(i.get())
        try:
            split_point = max(zip(gain_Ratios_dict.values(), gain_Ratios_dict.keys()))[1]
            points_list.append(split_point)
            times += 1
            temp_data = temp_data[temp_data[column_name] != split_point]
        except:
            print("Oops......\n", gain_Ratios_dict, "\n\n")
            break
        del all_Entropy, y_counts, gain_Ratios_dict
    del temp_data
    print(points_list)
    x = split_Data(data=data, column_name=column_name, points_List=points_list)
    return x

# 连续型数值变量区间缩放
def scaling(data):
    return data.sub(data.min(0), axis=1).div(data.max(0).sub(data.min(0)), axis=1)

# pandas的get_dummies做出来的矩阵列名只有属性名称，但是不能匹配到之前的原列名，所以修订加上了列名
def get_dummies(data, column_name):
    out_data = pd.get_dummies(data[column_name])
    out_data.columns = [column_name + "_" + str(i) for i in out_data.columns]
    return out_data

def calculation_pearson_corr(data, Y, k=10):
    Y = Y.sub(Y.mean(0))
    data = data.sub(data.mean(0), axis=1)
    pearson_Relation = np.abs(data.mul(Y, axis=0).sum(0) / np.sqrt(np.power(data, 2).sum(0).mul(np.power(Y, 2).sum(0)))).sort_values(ascending=False).iloc[:k]
    return pearson_Relation.index.to_list()

def process_Knn(data, Y, k=10, core=8):
    nan_data = data.loc[Y[Y.isnull().values == True].index, :]
    data = data.drop(Y[Y.isnull().values == True].index, axis=0)
    Y.dropna(inplace=True)
    numbers = int(len(nan_data) / core)
    pool = multiprocessing.Pool(processes=core)
    result = []
    for i in range(core):
        if i == 0:
            type_list = nan_data.iloc[:(numbers * (i + 1) + 1), :]
        elif i != (int(core) - 1):
            type_list = nan_data.iloc[(numbers * i + 1):(numbers * (i + 1) + 1), :]
        elif i == (int(core) - 1):
            type_list = nan_data.iloc[(numbers * (i) + 1):, :]
        result.append(pool.apply_async(loop_Knn, (data, type_list, Y, k, )))
    pool.close(), pool.join()
    del nan_data, data, numbers, pool, type_list, k, Y
    fill_data = pd.Series()
    for i in result:
        print(len(i.get()))
        fill_data = pd.concat([fill_data, i.get()], axis=0)
    return fill_data

def loop_Knn(data, nan_data, Y, k):
    fill_data = pd.Series(index=nan_data.index)
    for i in nan_data.index:
        value = KNN(data=data, target=nan_data.loc[i], Y=Y, k=k)
        fill_data[i] = value
        print("该列" + str(Y.name) + "\t第%d行空值完成填充" % i + "填充值：%.2f"%value)
    return fill_data

# 利用最近邻算法可以算出最接近NaN值的值类型
def KNN(data, target, Y, k):
    """
    :param data:     输入的用于匹配的样本，要求所有的字段都必须是数值型，剔除当前需要赋值的字段
    :param target:   输入需要赋值的字段对应的该客户其他字段
    :param Y:        输入需要赋值对应的字段
    :param k:        输入需要进行赋值的足够靠近的K个客户
    :return:         返回加权后的赋值数据
    """
    distance = np.sqrt(np.power(data.sub(target, axis=1), 2).sum(1))
    dis_Matrix = pd.concat([distance, Y], axis=1)
    dis_Matrix = dis_Matrix.sort_values(by=dis_Matrix.columns[0], axis=0).iloc[:k, :]
    dis_Matrix[dis_Matrix.columns[0]] = dis_Matrix[dis_Matrix.columns[0]] / dis_Matrix[dis_Matrix.columns[0]].sum()
    return dis_Matrix[dis_Matrix.columns[0]].mul(dis_Matrix[dis_Matrix.columns[1]], axis=0).sum()

def get_process_data():
    # 配置浮点数正常显示、行列显示
    np.set_printoptions(suppress=True)
    pd.set_option("display.max_columns", 50)
    pd.set_option("display.max_rows", 100)

    # 由于不清楚数据采集时间，暂不考虑2018年以后的样本
    data = pd.read_csv(r"F:\mySelfPlay\loan.csv").iloc[495242:]

    # 对因变量进行编码, 1为负面，0为正面
    data["loan_status"] = data["loan_status"].map(lambda x: func(x))

    # 剔除空值超过90%的字段
    na_values = data.isnull().sum(axis=0).sort_values(ascending=False) / float(len(data))
    data.drop(na_values[na_values >= 0.90].index.tolist(), axis=1, inplace=True)

    # 剔除一些具有重复性的字段
    # funded_amnt, funded_amnt_inv 与loan_amnt重复表示贷款本金
    # grade 与 sub_grade 都表示贷前评级，因此选择更具体的sub_grade具有的意义更高
    # emp_title工作名称类型过多，相对于工作年限及工作收入意义不大，剔除
    # issue_d放款日期无意义，剔除
    # pymnt_plan表示是否有有指定付款计划无意义，剔除
    # title 相当于purpose的详细描述，值过多，剔除
    # zip_code邮政编码与addr_state冲突，且值过多，剔除
    # initial_list_status 贷款的投资者接受状态，w相当于wait， f相当于funded，无意义，剔除
    # num_bc_sats、num_sats表示消费者满意的财务账户数、信用卡账户数， 无意义且与持有所有账户数、持有信用卡账户数指标重复，剔除
    # last_pymnt_d，last_pymnt_amnt, next_pymnt_d, last_credit_pull_d, hardship_flag， debt_settlement_flag, out_prncp, out_prncp_inv, total_pymnt, total_pymnt_inv, total_rec_prncp,
    # total_rec_late_fee, recoveries, collection_recovery_fee, collections_12_mths_ex_med, policy_code, tot_coll_amt, tot_cur_bal， 是贷后指标，分别是上次还款金额及日期、下次应还款日期、LC回收贷款日期、
    # 是否只还利息延期，是否催收公司参与后核销, 未还本金，未还本金投资者，已还金额，已还金额投资者，已收本金，已收罚息， 回收率， 催收催回利息， 1年内催收次数， 政策码， ， 不得参与违约率预测，剔除
    # earliest_cr_line 表示最早由信用记录的时间，通过放款日期减法算出天数时长，然后赋值回去，得到信用历史天数
    earliest_cr_line = data[['issue_d', 'earliest_cr_line']].dropna(0).applymap(lambda x: dt.datetime.strptime(x, "%b-%Y"))
    earliest_cr_line = earliest_cr_line['issue_d'].sub(earliest_cr_line['earliest_cr_line'], axis=0).map(lambda x: re.search(r"[0-9]+", str(x)).group())
    data['earliest_cr_line'] = data['earliest_cr_line'].reset_index().merge(earliest_cr_line.reset_index(), how='left', on='index')[0].tolist()

    del earliest_cr_line, na_values
    data.drop(['out_prncp', 'out_prncp_inv', 'total_pymnt', 'total_pymnt_inv', 'total_rec_prncp', 'total_rec_late_fee', 'recoveries', 'policy_code',
               'collection_recovery_fee', 'collections_12_mths_ex_med', 'funded_amnt', 'funded_amnt_inv', "grade", 'emp_title', "issue_d",
               "pymnt_plan", "title", "zip_code", "num_bc_sats", 'num_sats', "initial_list_status", "last_pymnt_d", "last_pymnt_amnt",
               "next_pymnt_d", "last_credit_pull_d", "hardship_flag", "debt_settlement_flag", 'total_rec_int'], axis=1, inplace=True)


    # mths_since_last_delinq 表示最近一次逾期距今的时间的月份求差， 对于空值填充Unknow， 并对小样本类别合并，l为划分出来的30个属性类别，依据l对原始字段划分
    data['mths_since_last_delinq'].fillna("Unknow", inplace=True)
    merge_SmallSimple(data=data, column_name='mths_since_last_delinq', threshold=100)
    # data['mths_since_last_delinq'] = split_points(data=data[['mths_since_last_delinq', 'loan_status']], column_name='mths_since_last_delinq', points_count=30)
    l = [87.0, 86.0, 85.0, 84.0,
         '88.0/93.0/89.0/91.0/92.0/90.0/94.0/95.0/96.0/99.0/98.0/100.0/101.0/97.0/105.0/102.0/103.0/106.0/110.0/107.0/109.0/104.0/111.0/108.0/114.0/112.0/113.0/116.0/115.0/120.0/118.0/121.0/129.0/122.0/146.0/117.0/135.0/134.0/131.0/119.0/133.0/123.0/124.0/126.0/125.0/136.0/132.0/130.0/170.0/152.0/140.0/127.0/142.0/188.0/158.0/149.0/148.0/128.0/145.0/141.0/137.0/151.0/139.0/153.0/195.0/192.0/202.0/180.0/178.0/176.0/171.0/150.0/168.0/162.0/143.0/160.0/159.0/138.0/157.0/156.0/154.0/161.0',
         81.0, 83.0, 82.0, 0.0, 79.0, 77.0, 80.0, 76.0, 75.0, 74.0, 72.0, 78.0, 73.0, 71.0, 69.0, 70.0, 66.0, 65.0,
         67.0, 68.0, 63.0, 1.0, 64.0, 62.0, 60.0]
    data['mths_since_last_delinq'] = data['mths_since_last_delinq'].map(lambda x: x if x in l else "Others")
    del l

    values = [['120.0/121.0/129.0', 6.0, 7.0, 1.0, 2.0, 3.0, 4.0, 5.0, 10.0, 8.0, 12.0, 14.0, 17.0, 13.0, 15.0, 9.0, 11.0, 16.0, 18.0, 19.0, 20.0, 21.0, 23.0, 24.0, 22.0, 25.0, 26.0, 119.0, 27.0, 28.0],
              [96.0, 99.0, 95.0, 92.0, 93.0, 90.0, 98.0, 94.0, 91.0, 89.0, 87.0, 88.0, 86.0, 0.0, 84.0, 83.0, 82.0, 3.0, 85.0, 1.0, '97.0/100.0/102.0/101.0/105.0/103.0/106.0/104.0/107.0/108.0/110.0/109.0/112.0/111.0/113.0/114.0/116.0/115.0/118.0/121.0/117.0/122.0/133.0/123.0/119.0/120.0/124.0/129.0/135.0/146.0/130.0/134.0/125.0/126.0/131.0/136.0/140.0/148.0/137.0/141.0/127.0/132.0/142.0/139.0/128.0/170.0/154.0/153.0/152.0/155.0/145.0/149.0/151.0/162.0/158.0/160.0/175.0/143.0/188.0/165.0/161.0/144.0/150.0/177.0/138.0/176.0/192.0/195.0/180.0/178.0/197.0/159.0/171.0/169.0/168.0/157.0/202.0/147.0/156.0', 2.0, 4.0, 5.0, 81.0, 6.0, 80.0, 7.0, 8.0, 79.0],
              [159.0, 163.0, 165.0, 168.0, 166.0, 158.0, 162.0, 160.0, 161.0, 155.0, 151.0, 154.0, 153.0, 152.0, 144.0, 164.0, 156.0, 157.0, 148.0, 146.0, 143.0, 149.0, 141.0, 142.0, 140.0, 139.0, 138.0, 150.0, 147.0, 145.0],
              [133.0, 131.0, 129.0, 127.0, 128.0, 126.0, 124.0, 123.0, 125.0, 122.0, 121.0, 119.0, 120.0, 116.0, 117.0, 115.0, 118.0, 114.0, 113.0, 111.0, 108.0, 110.0, 109.0, 104.0, 106.0, 107.0, 102.0, 112.0, 105.0, 101.0],
              [557.0, 538.0, 555.0, 540.0, 534.0, 535.0, 541.0, 530.0, 537.0, 547.0, 531.0, 543.0, 539.0, 522.0, 527.0, 521.0, 526.0, 528.0, 508.0, 520.0, 529.0, 525.0, 519.0, 523.0, 515.0, 518.0, 517.0, 514.0, 504.0, 12.0],
              [91.0, 89.0, 88.0, 85.0, 83.0, 78.0, 77.0, 79.0, 84.0, 81.0, 80.0, 82.0, 76.0, 75.0, 74.0, 73.0, 71.0, 72.0, 70.0, 69.0, 67.0, 68.0, 64.0, 66.0, 65.0, 62.0, 59.0, 61.0, 63.0, 58.0],
              [334.0, 320.0, 325.0, 326.0, 322.0, 318.0, 316.0, 323.0, 313.0, 311.0, 305.0, 307.0, 304.0, 310.0, 308.0, 309.0, 306.0, 312.0, 321.0, 319.0, 302.0, 298.0, 300.0, 296.0, 299.0, 301.0, 295.0, 297.0, 293.0, 289.0],
              [201.0, 198.0, 202.0, 206.0, 196.0, 190.0, 199.0, 194.0, 189.0, 193.0, 195.0, 197.0, 186.0, 192.0, 191.0, 184.0, 182.0, 188.0, 180.0, 178.0, 177.0, 175.0, 172.0, 174.0, 170.0, 181.0, 185.0, 187.0, 179.0, 176.0],
              [96.0, 93.0, 90.0, 95.0, 89.0, 99.0, 94.0, 92.0, 91.0, 87.0, 88.0, 86.0, 85.0, 84.0, 83.0, '97.0/100.0/98.0/101.0/105.0/102.0/103.0/104.0/110.0/106.0/107.0/108.0/111.0/109.0/112.0/115.0/113.0/116.0/114.0/121.0/119.0/129.0/118.0/117.0/120.0/134.0/131.0/122.0/125.0/124.0/123.0/135.0/140.0/146.0/145.0/127.0/133.0/136.0/126.0/128.0/142.0/155.0/149.0/130.0/137.0/157.0/152.0/170.0/162.0/132.0/158.0/154.0/153.0/151.0/139.0/144.0/150.0/165.0/195.0/189.0/188.0/186.0/176.0/174.0/202.0/161.0/160.0/159.0/143.0/156.0/148.0/138.0/141.0', 1.0, 0.0, 82.0, 2.0, 81.0, 80.0, 79.0, 3.0, 50.0, 78.0, 52.0, 55.0, 51.0, 77.0],
              ['25.0', 24.0, 22.0, 21.0, 23.0, 20.0, 19.0, 18.0, 17.0, 16.0, 15.0, 14.0, 13.0, 12.0, 11.0, 10.0, 9.0, 8.0, 7.0, 6.0, 5.0, 4.0, 3.0, 0.0, 2.0],
              [96.0, 93.0, 90.0, 92.0, 94.0, 99.0, 95.0, 91.0, 89.0, 87.0, 88.0, 85.0, 84.0, 83.0, '97.0/98.0/100.0/101.0/102.0/105.0/103.0/106.0/104.0/107.0/109.0/108.0/110.0/112.0/111.0/113.0/114.0/116.0/115.0/129.0/121.0/119.0/117.0/120.0/118.0/135.0/122.0/146.0/133.0/131.0/125.0/124.0/123.0/126.0/127.0/141.0/134.0/142.0/140.0/165.0/132.0/136.0/149.0/145.0/152.0/128.0/170.0/139.0/138.0/137.0/130.0/154.0/156.0/162.0/161.0/158.0/151.0/155.0/153.0/150.0/174.0/197.0/188.0/180.0/178.0/177.0/176.0/171.0/157.0/143.0/144.0/148.0/160.0/159.0/202.0', 0.0, 81.0, 86.0, 82.0, 80.0, 79.0, 77.0, 50.0, 1.0, 52.0, 53.0, 78.0, 55.0, 76.0, 51.0]]
    variables = ['mths_since_last_record', 'mths_since_last_major_derog', 'mths_since_rcnt_il', 'mo_sin_rcnt_rev_tl_op', "mo_sin_old_rev_tl_op",
              "mo_sin_rcnt_tl", 'mo_sin_old_il_acct', 'mths_since_recent_bc', 'mths_since_recent_bc_dlq', 'mths_since_recent_inq', 'mths_since_recent_revol_delinq']
    for i in range(len(values)):
        value = values[i]
        variable = variables[i]
        data[variable] = data[variable].map(lambda x: x if x in value else 'Others')
    del values, value, variable, variables
    # for i in ['mths_since_last_record', 'mths_since_last_major_derog', 'mths_since_rcnt_il', 'mo_sin_rcnt_rev_tl_op', "mo_sin_old_rev_tl_op",
    #               "mo_sin_rcnt_tl", 'mo_sin_old_il_acct', 'mths_since_recent_bc', 'mths_since_recent_bc_dlq', 'mths_since_recent_inq', 'mths_since_recent_revol_delinq']:
    #     data[i].fillna("Unknow", inplace=True)
    #     merge_SmallSimple(data=data, column_name=i, threshold=100)
    #     data[i] = split_points(data=data[[i, "loan_status"]], column_name=i, points_count=30)

    data['pct_tl_nvr_dlq'].fillna(100.000, inplace=True)
    out_data = scaling(data[['loan_amnt', 'int_rate', 'installment', 'annual_inc', 'dti', 'delinq_2yrs', 'earliest_cr_line',
                             'inq_last_6mths', 'open_acc', 'revol_bal', 'total_acc', 'acc_now_delinq', 'tot_coll_amt',
                             'open_acc_6m', 'open_act_il', 'open_il_12m', 'open_il_24m', 'open_rv_12m', 'open_rv_24m', 'il_util',
                             'max_bal_bc', 'all_util', 'total_rev_hi_lim', 'inq_fi', 'total_cu_tl', 'inq_last_12m', 'acc_open_past_24mths',
                             'bc_util', 'chargeoff_within_12_mths', 'delinq_amnt', 'mort_acc', 'num_actv_bc_tl', 'num_accts_ever_120_pd',
                             'num_actv_rev_tl', 'num_bc_tl', 'num_il_tl', 'num_op_rev_tl', 'num_rev_accts', 'num_rev_tl_bal_gt_0',
                             'num_tl_120dpd_2m', 'num_tl_30dpd', 'num_tl_90g_dpd_24m', 'num_tl_op_past_12m', 'pct_tl_nvr_dlq',
                             'pub_rec_bankruptcies', 'tax_liens', 'tot_hi_cred_lim', 'total_il_high_credit_limit']].fillna(0.0).astype(float))

    # emp_length 是工作年限，无数据使用未知表示
    data['emp_length'].fillna('Unknow', inplace=True)

    # purpose是借款用途，目前无法确认用途真实性，先进性合并处理，moving与vacation都是属于娱乐型， house与home_improvement都是属于家庭支出型
    data['purpose'] = data['purpose'].map(lambda x: 'vacation' if x in ['vacation', 'moving'] else x)
    data['purpose'] = data['purpose'].map(lambda x: 'house' if x in ['home_improvement', 'house'] else x)

    out_data = out_data.merge(pd.get_dummies(data[['term', 'sub_grade', 'emp_length', 'home_ownership', 'verification_status',
                                                   'purpose', 'addr_state', 'mths_since_last_delinq', 'mths_since_last_record',
                                                   'mths_since_last_major_derog', 'application_type', 'mths_since_rcnt_il'
                                                   ]]), how='inner', left_index=True, right_index=True)
    return out_data




    # 依据na_values的排序，对其他的具有过高的空值率字段进行赋值，并对其进行离散化加工

    # 核心思路对于三类进行字段进行填充
    # 第一类是 如开通账户数、信用卡账户数、交易次数等频率型字段，直接fillna(0)；
    # 第二类是 如最近一次出现公开负面记录的时间月份求差等时间长度字段，赋0肯定悖时了其没有记录的初衷，赋最大值但又不能保证二者具有同样的信息熵对因变量影响最低，解决方案是将其单独赋值为str类型的Unknow，
    # 这样子又牵涉到非数值型字段处理，如果该字段唯一值数量较少，直接ONE_HOT编码即可，如果该字段唯一值数量较多，可以利用最优离散化算法进行分割，加工出合适的离散型特征；
    # 第三类是 如余额等连续型数值字段，空值表示这个客户没有记录，直接赋0肯定会导致样本出现错误，简单的办法是用平均值、中位数、众数等代表性数值赋值，复杂点也可以使用最近邻算法加权均衡赋值

def get_Knn_Best_fill():
    # 495242:
    data = get_process_data()
    columns = ['loan_amnt', 'int_rate', 'installment', 'annual_inc', 'dti', 'delinq_2yrs', 'earliest_cr_line', 'inq_last_6mths', 'open_acc', 'revol_bal']
    data = data[columns]
    del columns

    temp_data = pd.DataFrame()
    for i in ['total_bc_limit', 'bc_open_to_buy', 'percent_bc_gt_75', 'total_bal_ex_mort', 'avg_cur_bal']:
        Y = pd.read_csv(r'F:\mySelfPlay\loan.csv').loc[495242:, i]
        fill_Y = process_Knn(data=data, Y=Y.copy(), k=20)
        Y.loc[np.isnan(Y)] = list(fill_Y)
        temp_data = temp_data.merge(pd.DataFrame(Y.values, columns=[Y.name], index=Y.index), how='outer', left_index=True, right_index=True)
    return temp_data

def random_sampling(data, count):
    return data.sample(n=count, replace=False)

def main(posi_data, nega_data, data_percent, nega_percent, core=os.cpu_count()):
    """
    :param posi_data: 整体的正样本
    :param nega_data: 整体的负样本
    :param data_percent: 该数据集占总体样本数量的比例
    :param nega_percent: 本次数据集中理想负样本比例
    :return:  划分后的数据集，划分后的剩余正样本，划分后的剩余负样本
    """
    # 按data_percent 找出正负样本
    # 多线程版本
    number = int(len(posi_data) / core)
    count = int(len(posi_data) * data_percent / core)
    pool, result = multiprocessing.Pool(processes=core), []
    for i in range(core):
        if i == 0:
            result.append(pool.apply_async(random_sampling, (posi_data.iloc[:(number * (i + 1) + 1), :], count, )))
        elif i != (core - 1):
            result.append(pool.apply_async(random_sampling, (posi_data.iloc[(number * i + 1):(number * (i + 1) + 1), :], count,)))
        elif i == (core - 1):
            result.append(pool.apply_async(random_sampling, (posi_data.iloc[(number * i + 1):, :], count,)))
    pool.close(), pool.join()
    temp_posi_data = pd.DataFrame()
    for i in result:
        temp_posi_data = pd.concat([temp_posi_data, i.get()], axis=0)
    # temp_posi_data = posi_data.sample(frac=data_percent)

    number = int(len(nega_data) / core)
    count = int(len(nega_data) * data_percent / core)
    pool, result = multiprocessing.Pool(processes=core), []
    for i in range(core):
        if i == 0:
            result.append(pool.apply_async(random_sampling, (nega_data.iloc[:(number * (i + 1) + 1), :], count, )))
        elif i != (core - 1):
            result.append(pool.apply_async(random_sampling, (nega_data.iloc[(number * i + 1):(number * (i + 1) + 1), :], count,)))
        elif i == (core - 1):
            result.append(pool.apply_async(random_sampling, (nega_data.iloc[(number * i + 1):, :], count,)))
    pool.close(), pool.join()
    temp_nega_data = pd.DataFrame()
    for i in result:
        temp_nega_data = pd.concat([temp_nega_data, i.get()], axis=0)
    # temp_nega_data = nega_data.sample(frac=data_percent)
    # 算出理想状态下划分后的数据集正样本比例
    posi_count = int(len(temp_nega_data) / nega_percent - len(temp_nega_data))
    # 正样本过少，直接结合
    if posi_count >= len(temp_posi_data):
        return_data = pd.concat([temp_posi_data, temp_nega_data], axis=0)
    # 正样本数量足够， 按照理想数量抽样出来
    else:
        number = int(len(temp_posi_data) / core)
        count = int(posi_count / core)
        pool, result = multiprocessing.Pool(processes=core), []
        for i in range(core):
            if i == 0:
                result.append(pool.apply_async(random_sampling, (temp_posi_data.iloc[:(number * (i + 1) + 1), :], count,)))
            elif i != (core - 1):
                result.append(pool.apply_async(random_sampling,
                                               (temp_posi_data.iloc[(number * i + 1):(number * (i + 1) + 1), :], count,)))
            elif i == (core - 1):
                result.append(pool.apply_async(random_sampling, (temp_posi_data.iloc[(number * i + 1):, :], count,)))
        pool.close(), pool.join()
        temp_posi_data = pd.DataFrame()
        for i in result:
            temp_posi_data = pd.concat([temp_posi_data, i.get()], axis=0)
        #temp_posi_data = temp_posi_data.sample(n=posi_count, replace=False)
        return_data = pd.concat([temp_posi_data, temp_nega_data], axis=0)
    # 按照划分后的正负样本，从原始数据集中剔除出去，避免其他数据集重复抽取
    posi_data.drop(list(temp_posi_data.index), axis=0, inplace=True)
    nega_data.drop(list(temp_nega_data.index), axis=0, inplace=True)
    return return_data, posi_data, nega_data


if __name__ == "__main__":
    import modelEvalution as me


    # revol_util 表示已使用总额度/ 可用总额度， 对于其空值填充，等待其他项完成空值完成后进行最近邻算法优化填充
    # total_bal_il 表示分期账户余额，对于其空值填充，等待其他项完成空值完成后进行最近邻算法优化填充
    # avg_cur_bal 表示所有账户的平均余额，对于其空值填充，等待其他项完成空值完成后进行最近邻算法优化填充
    # bc_open_to_buy 表示循环使用的信用卡用于购物的消费金额， 对于其空值填充，等待其他项完成空值完成后进行最近邻算法优化填充
    # percent_bc_gt_75 意义暂时不明，对于其空值填充，等待其他项完成空值完成后进行最近邻算法优化填充
    # total_bal_ex_mort 表示包括抵押贷款在内的所有贷款余额，对于其空值填充，等待其他项完成空值完成后进行最近邻算法优化填充
    # total_bc_limit 表示所有信用卡账户最高额度， 对于其空值填充，等待其他项完成空值完成后进行最近邻算法优化填充


    # data = get_process_data() #拿到未最优填充的字段
    # fill_data = main() # 最优KNN填充的字段
    X = pd.read_csv(r"F:\mySelfPlay\X.csv")

    # pca过后的线性相关极低，几乎可以认为不存在，但是没有计算最大信息素
    pca = PCA(n_components='mle', svd_solver='full')
    X = pd.DataFrame(pca.fit_transform(X))
    Y = np.array(pd.read_csv(r"F:\mySelfPlay\loan.csv").iloc[495242:]["loan_status"].map(lambda x: func(x)))
    # all_type = X['Y_values'].value_counts() / all_count
    logistic = LogisticRegression(penalty='l2', solver='lbfgs')
    model = logistic.fit(np.array(X), np.array(Y))
    compare_data = pd.DataFrame(model.predict_proba(np.array(X)))
    compare_data['true_Y'] = Y.tolist()
    compare_data.drop(compare_data.columns[0], axis=1, inplace=True)
    compare_data.columns = ['predict', 'true']
    compare_data['predict'] = compare_data['predict'].map(lambda x: round(x, 2))
    classi_point, FPR_list, TPR_list = me.ROC(compare_data['true'], compare_data['predict'], name='train_Logic')
    AUC = me.AUC(compare_data['true'], compare_data['predict'])
    x = pd.DataFrame([classi_point, FPR_list, TPR_list], index=['classifi_point', 'FPR', 'TPR']).T
    x['KS'] = x['TPR'] - x['FPR']
    classi_point = x.loc[x['KS'] == x['KS'].max(), 'classifi_point']
    compare_data['classifi'] = np.NaN
    compare_data.loc[compare_data['predict'] >= classi_point.values[0], 'classifi'] = 1.0
    compare_data.loc[compare_data['predict'] < classi_point.values[0], 'classifi'] = 0.0
    group = me.Confusion_Matrix(compare_data['true'], compare_data['classifi'])
    accuracy = me.accuracy(compare_data['true'], compare_data['classifi'])
    F1 = me.F1_score(compare_data['true'], compare_data['classifi'])
    print("本次全体样本模型结果:", "AUC:", AUC, "\tKS:",  x['KS'].max(), '\tF1:', F1, "\taccuracy", accuracy, '\n\n', group)
    X['Y_values'] = Y
    positive_X = X.loc[X['Y_values'] == 0]
    negative_X = X.loc[X['Y_values'] == 1]
    del X, Y

    # 样本分类，划分成训练集， 验证集， 测试集，分别按50%, 30%, 20%划分，先划分测试集，一摸一样的按照总体的伯努利分布，验证集按照{0:0.7, 1:0.3}, 训练集{0:0.6, 1:0.4}采集
    train_data, positive_X, negative_X = main(posi_data=positive_X, nega_data=negative_X, data_percent=0.50, nega_percent=0.4)
    verifi_data, positive_X, negative_X = main(posi_data=positive_X, nega_data=negative_X, data_percent=0.3/(1-0.5), nega_percent=0.3)
    test_data, positive_X, negative_X = main(posi_data=positive_X, nega_data=negative_X, data_percent=1, nega_percent=0.15)
    del positive_X, negative_X

    # 利用逻辑回归进行预测
    logistic = LogisticRegression(penalty='l2', solver='lbfgs', class_weight={1: 0.9, 0: 0.1}, C=10.0, max_iter=300)
    model = logistic.fit(np.array(train_data.loc[:, train_data.columns[:-1]]), np.array(train_data[train_data.columns[-1]]))
    compare_data = pd.DataFrame(model.predict_proba(np.array(train_data.loc[:, train_data.columns[:-1]])))
    compare_data['true_Y'] = train_data[train_data.columns[-1]].to_list()
    compare_data.drop(compare_data.columns[0], axis=1, inplace=True)
    compare_data.columns = ['predict', 'true']
    compare_data['predict'] = compare_data['predict'].map(lambda x: round(x, 2))
    classi_point, FPR_list, TPR_list = me.ROC(compare_data['true'], compare_data['predict'], name='train_Logic')
    AUC = me.AUC(compare_data['true'], compare_data['predict'])
    x = pd.DataFrame([classi_point, FPR_list, TPR_list], index=['classifi_point', 'FPR', 'TPR']).T
    x['KS'] = x['TPR'] - x['FPR']
    classi_point = x.loc[x['KS'] == x['KS'].max(), 'classifi_point']
    compare_data['classifi'] = np.NaN
    compare_data.loc[compare_data['predict'] >= classi_point.values[0], 'classifi'] = 1.0
    compare_data.loc[compare_data['predict'] < classi_point.values[0], 'classifi'] = 0.0
    group = me.Confusion_Matrix(compare_data['true'], compare_data['classifi'])
    accuracy = me.accuracy(compare_data['true'], compare_data['classifi'])
    F1 = me.F1_score(compare_data['true'], compare_data['classifi'])
    print("本次训练集模型结果:", "AUC:", AUC, "\tKS:",  x['KS'].max(), '\tF1:', F1, "\taccuracy", accuracy, '\n\n', group)

    verifi_compare = pd.DataFrame(model.predict_proba(np.array(verifi_data.loc[:, verifi_data.columns[:-1]])))
    verifi_compare['true'] = verifi_data[verifi_data.columns[-1]].to_list()
    verifi_compare.drop(verifi_compare.columns[0], axis=1, inplace=True)
    verifi_compare.columns = ['predict', 'true']
    verifi_compare['predict'] = verifi_compare['predict'].map(lambda x: round(x, 2))
    classi_point, FPR_list, TPR_list = me.ROC(verifi_compare['true'], verifi_compare['predict'], name='verifi_Logic')
    AUC = me.AUC(verifi_compare['true'], verifi_compare['predict'])
    x = pd.DataFrame([classi_point, FPR_list, TPR_list], index=['classifi_point', 'FPR', 'TPR']).T
    x['KS'] = x['TPR'] - x['FPR']
    classi_point = x.loc[x['KS'] == x['KS'].max(), 'classifi_point']
    verifi_compare['classifi'] = np.NaN
    verifi_compare.loc[verifi_compare['predict'] >= classi_point.values[0], 'classifi'] = 1.0
    verifi_compare.loc[verifi_compare['predict'] < classi_point.values[0], 'classifi'] = 0.0
    accuracy = me.accuracy(verifi_compare['true'], verifi_compare['classifi'])
    group = me.Confusion_Matrix(verifi_compare['true'], verifi_compare['classifi'])
    F1 = me.F1_score(verifi_compare['true'], verifi_compare['classifi'])
    print("本次验证集模型结果:", "AUC:", AUC, "\tKS:",  x['KS'].max(), '\tF1:', F1, "\taccuracy", accuracy, '\n\n', group)

    test_compare = pd.DataFrame(model.predict_proba(np.array(test_data.loc[:, test_data.columns[:-1]])))
    test_compare['true'] = test_data[test_data.columns[-1]].to_list()
    test_compare.drop(test_compare.columns[0], axis=1, inplace=True)
    test_compare.columns = ['predict', 'true']
    test_compare['predict'] = test_compare['predict'].map(lambda x: round(x, 2))
    classi_point, FPR_list, TPR_list = me.ROC(test_compare['true'], test_compare['predict'], name='test_Logic')
    AUC = me.AUC(test_compare['true'], test_compare['predict'])
    x = pd.DataFrame([classi_point, FPR_list, TPR_list], index=['classifi_point', 'FPR', 'TPR']).T
    x['KS'] = x['TPR'] - x['FPR']
    classi_point = x.loc[x['KS'] == x['KS'].max(), 'classifi_point']
    test_compare['classifi'] = np.NaN
    test_compare.loc[test_compare['predict'] >= classi_point.values[0], 'classifi'] = 1.0
    test_compare.loc[test_compare['predict'] < classi_point.values[0], 'classifi'] = 0.0
    accuracy = me.accuracy(test_compare['true'], test_compare['classifi'])
    group = me.Confusion_Matrix(test_compare['true'], test_compare['classifi'])
    F1 = me.F1_score(test_compare['true'], test_compare['classifi'])
    print("本次测试集模型结果:", "AUC:", AUC, "\tKS:",  x['KS'].max(), '\tF1:', F1, "\taccuracy", accuracy, '\n\n', group)

    # 逻辑回归效果一般，KS 勉强达到0.3，算法上面也未调优，来个集成算法，AdaBoost
    GB = GradientBoostingClassifier(n_estimators=150, learning_rate=0.1, subsample=1, loss='deviance', min_samples_split=2,
                                    min_samples_leaf=1, min_weight_fraction_leaf=0, max_depth=6, min_impurity_decrease=0,
                                    max_features='auto', max_leaf_nodes=20)
    model = GB.fit(np.array(train_data.loc[:, train_data.columns[:-1]]), np.array(train_data[train_data.columns[-1]]))
    compare_data = pd.DataFrame(model.predict_proba(np.array(train_data.loc[:, train_data.columns[:-1]])))
    compare_data['true_Y'] = train_data[train_data.columns[-1]].to_list()
    compare_data.drop(compare_data.columns[0], axis=1, inplace=True)
    compare_data.columns = ['predict', 'true']
    compare_data['predict'] = compare_data['predict'].map(lambda x: round(x, 2))
    classi_point, FPR_list, TPR_list = me.ROC(compare_data['true'], compare_data['predict'], name='train_Logic')
    AUC = me.AUC(compare_data['true'], compare_data['predict'])
    x = pd.DataFrame([classi_point, FPR_list, TPR_list], index=['classifi_point', 'FPR', 'TPR']).T
    x['KS'] = x['TPR'] - x['FPR']
    classi_point = x.loc[x['KS'] == x['KS'].max(), 'classifi_point']
    compare_data['classifi'] = np.NaN
    compare_data.loc[compare_data['predict'] >= classi_point.values[0], 'classifi'] = 1.0
    compare_data.loc[compare_data['predict'] < classi_point.values[0], 'classifi'] = 0.0
    group = me.Confusion_Matrix(compare_data['true'], compare_data['classifi'])
    accuracy = me.accuracy(compare_data['true'], compare_data['classifi'])
    F1 = me.F1_score(compare_data['true'], compare_data['classifi'])
    print("本次训练集模型结果:", "AUC:", AUC, "\tKS:",  x['KS'].max(), '\tF1:', F1, "\taccuracy", accuracy, '\n\n', group)

    verifi_compare = pd.DataFrame(model.predict_proba(np.array(verifi_data.loc[:, verifi_data.columns[:-1]])))
    verifi_compare['true'] = verifi_data[verifi_data.columns[-1]].to_list()
    verifi_compare.drop(verifi_compare.columns[0], axis=1, inplace=True)
    verifi_compare.columns = ['predict', 'true']
    verifi_compare['predict'] = verifi_compare['predict'].map(lambda x: round(x, 2))
    classi_point, FPR_list, TPR_list = me.ROC(verifi_compare['true'], verifi_compare['predict'], name='verifi_Logic')
    AUC = me.AUC(verifi_compare['true'], verifi_compare['predict'])
    x = pd.DataFrame([classi_point, FPR_list, TPR_list], index=['classifi_point', 'FPR', 'TPR']).T
    x['KS'] = x['TPR'] - x['FPR']
    classi_point = x.loc[x['KS'] == x['KS'].max(), 'classifi_point']
    verifi_compare['classifi'] = np.NaN
    verifi_compare.loc[verifi_compare['predict'] >= classi_point.values[0], 'classifi'] = 1.0
    verifi_compare.loc[verifi_compare['predict'] < classi_point.values[0], 'classifi'] = 0.0
    accuracy = me.accuracy(verifi_compare['true'], verifi_compare['classifi'])
    group = me.Confusion_Matrix(verifi_compare['true'], verifi_compare['classifi'])
    F1 = me.F1_score(verifi_compare['true'], verifi_compare['classifi'])
    print("本次验证集模型结果:", "AUC:", AUC, "\tKS:",  x['KS'].max(), '\tF1:', F1, "\taccuracy", accuracy, '\n\n', group)

    test_compare = pd.DataFrame(model.predict_proba(np.array(test_data.loc[:, test_data.columns[:-1]])))
    test_compare['true'] = test_data[test_data.columns[-1]].to_list()
    test_compare.drop(test_compare.columns[0], axis=1, inplace=True)
    test_compare.columns = ['predict', 'true']
    test_compare['predict'] = test_compare['predict'].map(lambda x: round(x, 2))
    classi_point, FPR_list, TPR_list = me.ROC(test_compare['true'], test_compare['predict'], name='test_Logic')
    AUC = me.AUC(test_compare['true'], test_compare['predict'])
    x = pd.DataFrame([classi_point, FPR_list, TPR_list], index=['classifi_point', 'FPR', 'TPR']).T
    x['KS'] = x['TPR'] - x['FPR']
    classi_point = x.loc[x['KS'] == x['KS'].max(), 'classifi_point']
    test_compare['classifi'] = np.NaN
    test_compare.loc[test_compare['predict'] >= classi_point.values[0], 'classifi'] = 1.0
    test_compare.loc[test_compare['predict'] < classi_point.values[0], 'classifi'] = 0.0
    accuracy = me.accuracy(test_compare['true'], test_compare['classifi'])
    group = me.Confusion_Matrix(test_compare['true'], test_compare['classifi'])
    F1 = me.F1_score(test_compare['true'], test_compare['classifi'])
    print("本次测试集模型结果:", "AUC:", AUC, "\tKS:",  x['KS'].max(), '\tF1:', F1, "\taccuracy", accuracy, '\n\n', group)



    # 尝试使用xgboost算法，对数据集需要先做X，Y分开，再转化为xgb需要的格式
    # train_data = xgb.DMatrix(train_data[train_data.columns[:-1]], label=train_data[train_data.columns[-1]])
    # verifi_data = xgb.DMatrix(verifi_data[verifi_data.columns[:-1]], label=verifi_data[verifi_data.columns[-1]])
    # test_data = xgb.DMatrix(test_data[test_data.columns[:-1]], label=test_data[test_data.columns[-1]])
    #
    # # 配置模型参数
    # param = {'eta': 0.1, 'max_depth': 8, 'min_child_weight': 0.5, 'gamma': 1, 'lambda': 10, 'alpha': 5, 'subsample': 1, 'objective': 'binary:logistic', 'verbosity':0}
    # watchlist = [(verifi_data, 'eval'), (train_data, 'train')]
    # model = xgb.train(params=param, dtrain=train_data, num_boost_round=25, evals=watchlist)
    #
    # # 对模型进行评估
    # compare_data = pd.DataFrame(model.predict(train_data))
    # compare_data['true_Y'] = train_data.get_label()
    # compare_data.columns = ['predict', 'true']
    # compare_data['predict'] = compare_data['predict'].map(lambda x: round(x, 2))
    # classi_point, FPR_list, TPR_list = me.ROC(compare_data['true'], compare_data['predict'], name='train_Xgb')
    # AUC = me.AUC(compare_data['true'], compare_data['predict'])
    # x = pd.DataFrame([classi_point, FPR_list, TPR_list], index=['classifi_point', 'FPR', 'TPR']).T
    # x['KS'] = x['TPR'] - x['FPR']
    # classi_point = x.loc[x['KS'] == x['KS'].max(), 'classifi_point']
    # compare_data['classifi'] = np.NaN
    # compare_data.loc[compare_data['predict'] >= classi_point.values[0], 'classifi'] = 1.0
    # compare_data.loc[compare_data['predict'] < classi_point.values[0], 'classifi'] = 0.0
    # accuracy = me.accuracy(compare_data['true'], compare_data['classifi'])
    # group = me.Confusion_Matrix(compare_data['true'], compare_data['classifi'])
    # F1 = me.F1_score(compare_data['true'], compare_data['classifi'])
    # print("本次训练集模型结果:", "AUC:", AUC, "\tKS:",  x['KS'].max(), '\tF1:', F1, "\taccuracy", accuracy, '\n\n', group)
    #
    # verifi_compare = pd.DataFrame(model.predict(verifi_data))
    # verifi_compare['true'] = verifi_data.get_label()
    # verifi_compare.columns = ['predict', 'true']
    # verifi_compare['predict'] = verifi_compare['predict'].map(lambda x: round(x, 2))
    # classi_point, FPR_list, TPR_list = me.ROC(verifi_compare['true'], verifi_compare['predict'], name='verifi_Xgb')
    # AUC = me.AUC(verifi_compare['true'], verifi_compare['predict'])
    # x = pd.DataFrame([classi_point, FPR_list, TPR_list], index=['classifi_point', 'FPR', 'TPR']).T
    # x['KS'] = x['TPR'] - x['FPR']
    # classi_point = x.loc[x['KS'] == x['KS'].max(), 'classifi_point']
    # verifi_compare['classifi'] = np.NaN
    # verifi_compare.loc[verifi_compare['predict'] >= classi_point.values[0], 'classifi'] = 1.0
    # verifi_compare.loc[verifi_compare['predict'] < classi_point.values[0], 'classifi'] = 0.0
    # accuracy = me.accuracy(verifi_compare['true'], verifi_compare['classifi'])
    # group = me.Confusion_Matrix(verifi_compare['true'], verifi_compare['classifi'])
    # F1 = me.F1_score(verifi_compare['true'], verifi_compare['classifi'])
    # print("本次验证集模型结果:", "AUC:", AUC, "\tKS:",  x['KS'].max(), '\tF1:', F1, "\taccuracy", accuracy, '\n\n', group)
    #
    # test_compare = pd.DataFrame(model.predict(test_data))
    # test_compare['true'] = test_data.get_label()
    # test_compare.columns = ['predict', 'true']
    # test_compare['predict'] = test_compare['predict'].map(lambda x: round(x, 2))
    # classi_point, FPR_list, TPR_list = me.ROC(test_compare['true'], test_compare['predict'], name='test_Xgb')
    # AUC = me.AUC(test_compare['true'], test_compare['predict'])
    # x = pd.DataFrame([classi_point, FPR_list, TPR_list], index=['classifi_point', 'FPR', 'TPR']).T
    # x['KS'] = x['TPR'] - x['FPR']
    # classi_point = x.loc[x['KS'] == x['KS'].max(), 'classifi_point']
    # test_compare['classifi'] = np.NaN
    # test_compare.loc[test_compare['predict'] >= classi_point.values[0], 'classifi'] = 1.0
    # test_compare.loc[test_compare['predict'] < classi_point.values[0], 'classifi'] = 0.0
    # accuracy = me.accuracy(test_compare['true'], test_compare['classifi'])
    # group = me.Confusion_Matrix(test_compare['true'], test_compare['classifi'])
    # F1 = me.F1_score(test_compare['true'], test_compare['classifi'])
    # print("本次测试集模型结果:", "AUC:", AUC, "\tKS:",  x['KS'].max(), '\tF1:', F1, "\taccuracy", accuracy, '\n\n', group)

import numpy as np
import pandas as pd
np.set_printoptions(suppress=True)

# data格式为m*(i+1)，其中m是指样本个数，i为特征变量维度（包括一列为标签结果Y）。params格式应为（i+1）*1，（i+1）为特征变量权重系数
def data_processing(data, n):
    data = data.astype(float)
    X = data.drop(data.columns[n], axis=1)
    X['x0'] = 1.0
    Y = data.iloc[:, n]
    return X, Y

def Logic_func(X, params): #逻辑回归的分类模型
    return 1 / (1 + np.exp(X.dot(params)))

def Logic_cost(X, Y, params): #逻辑回归的代价函数
    Y_predict = Logic_func(X, params)
    return (-(Y.dot(np.log(Y_predict)) + (1 - Y).dot(np.log(1 - Y_predict)))/len(Y))[0]

def LRGD(data, n, times=10000, threshold_change=0.00000001, alpha=0.1, error_threshold=0.0005):
    X, Y = data_processing(data, n)

    count = 0
    params = np.zeros((len(X.columns), 1))
    errors_dict = {}
    params_dict = {}

    while count <= times: #执行times次梯度下降
        if count == 0: #第一次执行时，为了实现下降幅度阈值，做了区分
            error = Logic_cost(X, Y, params)
            errors_dict[count] = error
            params_dict[count] = params
            Y_predict = Logic_func(X, params)
            params = params + np.array(alpha * X.T.dot(Y_predict.sub(Y, axis=0))) / float(len(Y)) #更新params
            count = count + 1
            error = Logic_cost(X, Y, params)
            if error <= error_threshold: #本次params实现的误差小于阈值，提前终止梯度下降
                break
        else:
            if abs(error-errors_dict[count-1]) > threshold_change:
                error = Logic_cost(X, Y, params)
                errors_dict[count] = error
                params_dict[count] = params
                Y_predict = Logic_func(X, params)
                params = params + np.array(alpha * X.T.dot(Y_predict.sub(Y, axis=0))) / float(len(Y))
                count = count + 1
                error = Logic_cost(X, Y, params)
                if error <= error_threshold:
                    break
            else: #本次梯度下降带来的误差削减幅度小于阈值，提前终止梯度下降
                break
    return params, errors_dict, count

def ClassiPoint(X, Y, params):
    Y_predict = Logic_func(X, params).sort_values(0)
    classification_dict = {}
    for i in Y_predict.iloc[:, 0]:
        Y_predict_ot = Y_predict[:]
        Y_classi = pd.Series(np.where(Y_predict_ot <= i, 0, 1).T[0], index=Y_predict_ot.index).sort_index()
        error_rate = np.abs(Y - Y_classi).mean()
        classification_dict[i] = error_rate
    return min(classification_dict, key=classification_dict.get), classification_dict[min(classification_dict, key=classification_dict.get)]










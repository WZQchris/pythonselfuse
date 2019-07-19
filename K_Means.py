import pandas as pd
import numpy as np
import multiprocessing as ml
import os, random
import matplotlib.pyplot as plt

def K_means(data, k, times=100):
    """
    :param data:   DataFrame类型样本
    :param k:      需要分类的簇数量
    :param times:  支持寻找最优分类簇的次数
    :return:       DataFrame类型误差精度数据
    """
    # 第一次寻找最优分类簇，需要从样本里随机抽取k个样本作为初始质点
    particles = []
    for i in range(k):
        temp_particle = random.randint(0, len(data))
        # 若本次随机抽取结果已经出现过，重新抽样，直至结果为k个各不相同的质点
        while temp_particle in particles:
            temp_particle = random.randint(0, len(data))
        particles.append(temp_particle)
    # 配置质点矩阵，方便矩阵化运算
    particles_matrix = data.iloc[particles, :]
    time = 0
    last_SSE_values = 10000000000000000
    # 如果误差精度一直在下降，那么一直执行while里面的代码，直到跑完所有的次数
    while time <= times:
        time += 1
        # 配置误差精度矩阵，对每个数据点算出对每个簇的距离，选择距离最小即精度最高的簇作为分类，并把其他簇精度强制归为0
        SSE_data = pd.DataFrame(index=particles_matrix.index, columns=[i for i in range(len(data))])
        for i in range(len(data)):
            temp_SSE = np.power(particles_matrix.sub(data.iloc[i, :], axis=1), 2).sum(1)
            SSE_data[i] = list(temp_SSE.map(lambda x:x if x == temp_SSE.min() else 0.0))
        # 如果本次质点的分类簇精度在下降，说明还没有到最优点，继续执行
        if SSE_data.sum().sum() - last_SSE_values < 0:
            # 更新误差精度对比值
            last_SSE_values = SSE_data.sum().sum()
            print('第%d次执行分类'%time, '\t误差精度：', SSE_data.sum().sum())
            # 重新设置质点矩阵，质点从本次分类簇的平均值means提取
            particles_matrix = pd.DataFrame(columns=data.columns, index=[i for i in range(k)])
            for i in range(k):
                group_index = SSE_data.iloc[i, :][SSE_data.iloc[i, :] != 0.0].index.to_list()
                particles_matrix.iloc[i, :] = list(data.iloc[group_index, :].mean())
        # 如果本次质点的分类簇精度反而比上一次更高，说明质点划分不对，停止执行，直接返回数据
        else:
            break
    return SSE_data

if __name__ == '__main__':
    data = pd.DataFrame(np.random.randint(low=0, high=10000, size=(1000, 2)), columns=['x1', 'x2'])
    cluster = 7
    SSE_data = K_means(data=data, k=cluster)
    markers = ["o", "^", "2", "s", "P", "X", "D", "|", '_', '.', 'v', '1', 'p']
    for i in range(cluster):
        color = "#%02x%02x%02x"%(random.randint(0, 256), random.randint(0, 256), random.randint(0, 256))
        group_index = SSE_data.iloc[i, :][SSE_data.iloc[i, :] != 0.0].index.to_list()
        if i < len(markers):
            plt.scatter(data.iloc[group_index, 0], data.iloc[group_index, 1], c=color, marker=markers[i])
        else:
            plt.scatter(data.iloc[group_index, 0], data.iloc[group_index, 1], c=color, marker=markers[i - len(markers)])

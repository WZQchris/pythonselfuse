# -*- coding: utf-8 -*-
import datetime as dt
import sys
sys.setrecursionlimit(1000000)


#冒泡排序BU
def  BubbleSort(array):
    x = 0   #计算本轮无须交换的次数
    for i in range(len(array)-1): #对每两个相邻的元素进行配对
        if array[i] > array[i+1]: #前一个元素数值较大时，交换位置
            tem = array[i]
            array[i] = array[i+1]
            array[i+1] = tem
        elif array[i] <= array[i+1]: #无须交换，x+1
            x = x + 1
    if x != (len(array)-1): #递归条件，无须交换次数x未达到最大值，说明排序未完成，再次进行
        BubbleSort(array)
    return array


#直接排序
def StraightSort(array):
    newarray = []    #设定需要新的list
    for i in range(len(array)-1):   #对原始list执行n-1次循坏，每次把原始元素依小至大放入新list
        x=array[0]     #设定比较初始值，默认为第一个元素
        for j in array:    #循坏list
            if x >= j:     #初始值对比list每个元素大小，将x赋值为当前循环中最小的元素
                x = j
        newarray.append(x)   #将本次最小值顺序插入新list
        array.remove(x)     #剔除本次插入的最小值，减少计算机消耗资源
    newarray.append(array[0])  #最后原始list只剩一个最大值，直接放入新list
    return newarray
    

#反转排序
def ReverseSort(array):
    x = len(array) // 2
    for i in range(x):
        temp = array[i]
        array[i] = array[-i]
        array[-i] = temp
    
    return array


def RunTime_process(array, functions):
    startime = dt.datetime.now()
    sortarray = functions(array)
    endtime = dt.datetime.now()
    runtime = endtime - startime
    return sortarray, runtime 

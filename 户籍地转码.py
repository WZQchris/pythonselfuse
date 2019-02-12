# -*- coding: utf-8 -*-
import numpy as np
import pandas as pd
import re
import chardet as ch

f = open(unicode('C:\Users\mime\Desktop\户籍地对应编码.txt','utf-8'),'r')
x = f.read()
f.close()
x = x.decode('gb2312')#转码成unicode格式

#print x

a = re.findall(r'\b\d{6}\b',x)
b = re.findall(u"[\u4e00-\u9fa5]+",x)#检索Unicode格式中文
dit = {}
a_num = [int(u) for u in a]#身份证前6位由str转int

for i in np.arange(len(a)):#生成代码字典
    dit[a_num[i]] = b[i]

df_dit = pd.Series(dit)
df_dit = pd.DataFrame(df_dit,columns=['address'])#转成DATAFRAME格式
x = list(df_dit.index)#获得身份证前六位代码
df_dit['number'] = x#添加新一列身份证前六位代码
df_od = pd.read_csv(unicode('C:\Users\mime\Desktop\户籍地逾期客户.csv','utf-8'))
df = pd.merge(df_dit,df_od,how='inner',left_on='number',right_on='card_no')
df1 = pd.merge(df_dit,df_od,how='inner',left_on='number',right_on='card_no')

address = []
for i in df1['address']:
    address.append(i.encode('gb2312')) #转码为可以可以写入的格式   
df1['address'] = address

df1.to_csv(unicode('C:\Users\mime\Desktop\户籍地转码逾期.csv','utf-8'))

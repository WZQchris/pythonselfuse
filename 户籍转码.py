# -*- coding: utf-8 -*-
str1 = """北京11 天津12 河北13 山西14 内蒙古15 辽宁21 吉林22 黑龙江23 上海31 江苏32 浙江33 安徽34 福建35 江西36 山东37 河南41 湖北42 湖南43 广东44 广西45 海南46 重庆50 四川51 贵州52 云南53 西藏54 陕西61 甘肃62 青海63 宁夏64 新疆65"""
import chardet as ch
#print ch.detect(str1)
import re
pattern1 = re.compile(r'\d+\b')
number = re.findall(pattern1, str1)

pattern2 = re.compile(ur"[\u4e00-\u9fa5]+")
provinces = re.findall(pattern2, str1.decode('utf-8'))

dit = {}
for i in range(len(provinces)):
    dit[number[i]] = provinces[i]

import pandas as pd
data = pd.read_excel(unicode(r'E:\金融服务部-吴智强\百度有钱花基础数据.xlsx','utf-8'))
province = []
for i in data[u'身份证号码']:
    province.append(dit[i[:2]])
data[u'客户户籍地'] = province









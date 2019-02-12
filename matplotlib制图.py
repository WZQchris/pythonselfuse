# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
data = pd.read_excel(unicode(r'E:\金融服务部-吴智强\百度有钱花基础数据.xlsx','utf-8'))
data_pass = data[(data[u'贷款进度']==u'未打款')|(data[u'贷款进度']==u'已打款')]
store_pass = data_pass.groupby(u'申请门店')[u'身份证号码'].count()
store_pass.sort_values(ascending=False, inplace=True)

figure, ax = plt.subplots(figsize=(11,9))
from matplotlib.font_manager import FontProperties
from matplotlib.ticker import  MultipleLocator
font_set = FontProperties(fname=r'C:\Windows\Fonts\STFANGSO.ttf',size=14) 
ax.bar(np.arange(21),store_pass.values)
ax.xaxis.set_major_locator(MultipleLocator(1))
ax.set_xticklabels([i for i in store_pass.index.format()], rotation=50, fontproperties=font_set)
plt.show()
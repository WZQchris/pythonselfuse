# -*- coding: utf-8 -*-
import matplotlib.pyplot as plt
from mpl_toolkits.basemap import Basemap
import pandas as pd
import numpy as np
from matplotlib.patches import Polygon
from matplotlib.colors import rgb2hex
plt.figure(figsize=(16,8))
m = Basemap(llcrnrlon=77, llcrnrlat=14, urcrnrlon=140, urcrnrlat=51, projection='lcc', lat_1=33, lat_2=45, lon_0=100)
m.drawcoastlines()
m.drawcountries(linewidth=1.5)
m.readshapefile('E:\python\pythontech\gadm36_CHN_shp/gadm36_CHN_1', 'states', drawbounds=True)

df = pd.read_excel(unicode('E:\金融服务部-吴智强/百度有钱花户籍通过率数据.xlsx','utf-8'))
df.set_index(u'客户户籍地',inplace=True)
df = (df*10000)

statenames=[]
colors={}
cmap = plt.cm.YlOrRd
vmax = 6667.0
vmin = 0.0

for shapedict in m.states_info:
    statename = shapedict['NL_NAME_1']
    p = statename.split('|')
    if len(p) > 1:
        s = p[1]
    else:
        s = p[0]
    if s == '黑龍江省':
        s = '黑龙江'
    if s == '广西壮族自治区':
        s = '广西'
    if s == '内蒙古自治区':
        s = '内蒙古'
    if s == '宁夏回族自治区':
        s = '宁夏'
    if s == '新疆维吾尔自治区':
        s = '新疆'
    if s == '西藏自治区':
        s = '西藏'
    statenames.append(s)
    pop = df[u'身份证号码'][s.decode('utf-8')]
    colors[s] = cmap(np.sqrt((pop - vmin) / (vmax - vmin)))[:3]

ax = plt.gca()
for nshape, seg in enumerate(m.states):
    color = rgb2hex(colors[statenames[nshape]])
    poly = Polygon(seg, facecolor=color, edgecolor=color)
    ax.add_patch(poly)
plt.show()
import numpy as np
import pandas as pd
import pyecharts as pch
import random

# sttr = ["{}天".format(i) for i in range(1, 31)]
# v1 = [random.randint(100, 150) for i in range(30)]
# v2 = [random.randint(200, 350) for i in range(30)]
# bar = pch.Bar('随机数生成测试', extra_html_text_label=["\t从数据表现上来看：\n\t本周我们的申请件有XX多，其中", "color:black"])
# bar.add("", sttr, v1, label_color=['rgba(0,0,0,0)'], is_stack=True, xaxis_rotate=45)
# bar.add("随机数2", sttr, v2, xaxis_interval=0, is_label_show=True, label_pos='inside', label_text_color="#2B2B2B", is_stack=True, xaxis_rotate=70)
# bar.render(r'E:\python\test.html')

# attr = ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
# v1 = [5, 20, 36, 10, 75, 90]
# v2 = [10, 25, 8, 60, 20, 80]
# bar = pch.Bar("柱状图数据堆叠示例")
# bar.add("商家A", attr, v1, is_stack=True)
# bar.add("商家B", attr, v2, is_stack=True)
# bar.render(r'E:\python\test.html')

# v1 = [10, 20, 30, 40, 50, 60]
# v2 = [25, 20, 15, 10, 60, 33]
# es = pch.EffectScatter('动态散点图示例')
# es.add("资产负债散点图", v1, v2, is_label_show=True, symbol_size=26, symbol='pin', effect_scale=2, effect_brushtype='stroke', effect_period=10)
# es.render(r'E:\python\test.html')

attr = ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
v1 = [5, 20, 36, 10, 75, 90]
v2 = [10, 25, 8, 60, 20, 80]
v3 = [i+j for i,j in zip(v1,v2)]
funn = pch.Funnel('漏斗图示例')
funn.add("商品", attr, v3, is_label_show=True, is_legend_show=True, funnel_sort='ascending', label_pos='outside', label_text_color='#2B2B2B', legend_orient='vertical', legend_pos='left')
funn.render(r'E:\python\test.html')
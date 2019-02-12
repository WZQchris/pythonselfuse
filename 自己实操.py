# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

#f = pd.read_csv(unicode('C:\Users\mime\Desktop/vintage逾期分析.csv','utf-8'),encoding='gbk')

#column = [unicode('放款月份','utf-8'),unicode('M3+逾期率','utf-8'),unicode('M4+逾期率','utf-8'),unicode('M5+逾期率','utf-8'),unicode('M6+逾期率','utf-8')]

#vintage = f.fillna(0)[column]

#print vintage
#plt.show(vintage.plot)

df = pd.read_csv(unicode(r'E:\SQL教程\python\pydata-book-2nd-edition\datasets\fec\P00000001-ALL.csv','utf-8'))

#df = df[['cmte_id', 'cand_id', 'cand_nm', 'contbr_nm', 'contbr_city',
       #'contbr_st', 'contbr_zip', 'contbr_employer', 'contbr_occupation',
       #'contb_receipt_amt']]

parties = {'Bachmann, Michelle':'Republican',
           'Romney, Mitt':'Republican',
           'Obama, Barack':'Democrat',
           "Roemer, Charles E. 'Buddy' III":'Republican',
           'Pawlenty, Timothy':'Republican',
           'Johnson, Gary Earl':'Republican',
           'Paul, Ron':'Republican',
           'Santorum, Rick':'Republican',
           'Cain, Herman':'Republican',
           'Gingrich, Newt':'Republican',
           'McCotter, Thaddeus G':'Republican',
           'Huntsman, Jon':'Republican',
           'Perry, Rick':'Republican'}

df['party'] = df['cand_nm'].map(parties)

df = df[df['contb_receipt_amt']>0]

#grouped = df.groupby(['contbr_nm','contbr_zip'])['contb_receipt_amt']
#grouped_all = grouped.agg(['count','max','sum'])
#grouped_all = grouped_all[grouped_all['count']>0].sort_index(by='count',ascending=False)

#print grouped_all
df_mrbo = df[df['cand_nm'].isin(['Obama, Barack','Romney, Mitt'])]
grouped = df_mrbo.groupby(['cand_nm','contbr_st'])
totals = grouped['contb_receipt_amt'].sum().unstack('cand_nm').fillna(0)
totals = totals[totals.sum(axis=1)>100000]

percent = totals.div(totals.sum(axis=1),axis=0)

import numpy as np
import pandas as pd

def Bayes_Probability(data, n):
    Bayes_Probability = {}
    for i in data.drop(data.columns[n], axis=1).columns:
        grouped = data.groupby([data.columns[n], i])[data.columns[n]].count().unstack(1).fillna(0.1).astype(float)
        Bayes_Probability[i] = grouped.div(grouped.sum(axis=1), axis=0)
    return Bayes_Probability

def predict_probability(test, data, n):

    test['Result'] = np.NaN
    for i in test.index:
        test_index_data = test.iloc[i, :]
        predict_pro = pd.Series(np.ones(len(data.iloc[:, n].unique())))
        for x in test.columns:
            predict_pro = pd.Series(predict_pro * Bayes_Probability(data, n)[x].loc[:, test_index_data[x]], index=(Bayes_Probability(data, n)[x].loc[:, test_index_data[x]]).index)
        grouped = data.groupby(data.columns[n])[data.columns[n]].count()
        Y_Probability = grouped / grouped.sum()

        final_predict_pro = Y_Probability * predict_pro
        test.loc[i, 'Result'] = final_predict_pro[final_predict_pro == max(final_predict_pro)].index.format()[0]

from ShoesRe import ShoesRe as sh
import os
import pandas as pd
import numpy as np
import re


path = r"E:\python\pythonselfuse\PYSshoes"
max_page = max([int(i[10:-5]) for i in os.listdir(path)])
img = []
name = []
price = []

for i in os.listdir(path):
    with open(r"%s\%s"%(path, i), "r") as fp:
        file = fp.read()

    x = sh(file).re_list_all()
    if (len(x) == 40) or (int(i[10:-5]) == max_page):
        page_img = [sh(j).re_img() for j in x]
        page_name = [sh(i).re_name()[0][7:-1] for i in x]
        page_price = [sh(i).re_price() for i in x]
        img.extend(page_img)
        name.extend(page_name)
        price.extend(page_price)

    else:
        print(i + "该页内容解析鞋子品类不足40双")

data = pd.concat([pd.DataFrame(np.array(img)), pd.DataFrame(np.array(name)), pd.DataFrame(np.array(price))], axis=1)
data.columns = ["shoes_img", "shoes_name", "shoes_price"]
data["regular_price"] = data["shoes_price"].map(lambda x: float(x[0]) if len(x) != 1 else float(x[0]))
data["special_price"] = data["shoes_price"].map(lambda x: float(x[1]) if len(x) != 1 else np.NaN)

def sex_func(x):
    sex = []
    for i in x.split(" "):
        if i in ["Women", "Men", "Big", "Little", "Kids", "Infant", "Toddlers"]:
           sex.append(i)

    sex = " ".join(sex)

    if sex == '':
        return None
    else:
        return sex
data["shoes_sex"] = data["shoes_name"].map(sex_func)

def color_func(x):
    parameter = re.compile(r"\(([a-zA-Z0-9\s\/]+)\)")
    color = parameter.findall(x)
    return "".join(color)
data["shoes_color"] = data["shoes_name"].map(color_func)

data['shoes_brand'] = data['shoes_name'].map(lambda x: re.match(r'([a-zA-Z]+)\s?', x).group() if re.match(r'([a-zA-Z]+)\s?', x) != None else None)
data.loc[data['shoes_brand'] == 'New', 'shoes_brand'] = "New Balance"
data.loc[data['shoes_brand'] == 'Onitsuka', 'shoes_brand'] = "Onitsuka Tiger"
data.loc[data['shoes_brand'] == 'The', 'shoes_brand'] = "The Hundreds"
data.loc[data['shoes_brand'] == 'Diamond', 'shoes_brand'] = "Diamond Supply"
data.loc[data['shoes_brand'] == 'PF', 'shoes_brand'] = "PF Flyers"
data.loc[data['shoes_brand'] == 'AH', 'shoes_brand'] = "Android Homme"
data.loc[data['shoes_brand'] == 'Android', 'shoes_brand'] = "Android Homme"
data.loc[data['shoes_brand'] == 'Huf', 'shoes_brand'] = "HUF"
data.loc[data['shoes_brand'] == 'JB', 'shoes_brand'] = "JB Classics"
data.loc[data['shoes_brand'] == 'Etnies', 'shoes_brand'] = "Etnies Plus"






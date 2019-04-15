import re
import os

class myLikeRe(object):

    def __init__(self, txt):
        self.txt = txt

    def part(self):
        para = re.compile(r"""<tr onclick="changeRadio\(this\);" style="cursor: pointer;background: ;line-height: 35px;" >\s+<td>\s+<input type="radio" name="ids" class="radio"  subjectid="[a-zA-Z0-9\+/=]+" value=""/>\s+<input type="hidden" id="subjectid_" value="[a-zA-Z0-9\+/=]+"/>\s+</td>\s+<td>[0-9]{1,2}</td>\s+<td>[0-9a-zA-Z\u4e00-\u9fa5\（\）\s-]+</td>\s+<td>[0-9\s\.-]+</td>\s+</tr>""")
        part = para.findall(self.txt)
        return part

    def find_name(self):
        para_name = re.compile(r"""<td>([0-9a-zA-Z\u4e00-\u9fa5\（\）\s-]+)</td>""")
        return para_name.findall(self.txt)[1]

    def find_amount(self):
        para_amount = re.compile(r"""<td>([0-9\s\.-]+)</td>\s+</tr>""")
        return para_amount.findall(self.txt)[0]




path = r"C:\Users\wuzhiqiang\Desktop\test"
data_dict = {}
for i in os.listdir(path):
    with open((path + "\\" + i), encoding="utf-8") as fp:
        file = fp.read()
    text = myLikeRe(file)
    name_dict = {}
    for j in text.part():
        txt = myLikeRe(j)
        name_dict[txt.find_name()] = txt.find_amount()
    data_dict[i[:-5]] = name_dict

print(data_dict)


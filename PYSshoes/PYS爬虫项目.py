import requests
import os
import pandas as pd
import re
import time
import random

# 构建headers字典，访问PYS门户网页
headers = {
    'Host': 'www.pys.com',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9'
}
response = requests.get("http://www.pys.com/", headers)
cookies = requests.cookies.RequestsCookieJar()
cookies.update(response.cookies)

# 访问鞋子品类页面，保存网页源代码为后续提取数据进行准备
headers['Cache-Control'], headers['Referer'] = 'max-age=0', 'http://www.pys.com/'
url = "http://www.pys.com/shoes"
shoes_response = requests.get(url, headers=headers, cookies=cookies)

if not os.path.exists(r"E:\python\pythonselfuse\PYSshoes"):
    os.makedirs(r"E:\python\pythonselfuse\PYSshoes")

with open(r"E:\python\pythonselfuse\PYSshoes\shoes_page1.html", "wb") as fp:
    fp.write(shoes_response.text.encode())

# 确认目前一共有多少款在售，根据每页40款的规则算出一共需要爬多少页，循环爬取并保存源代码
shoes_number = int(re.findall(r'<p class="amount amount--has-pages">\n                    \d+\-\d+ of \d+                </p>', shoes_response.text)[0][-24:-20])
for i in range(2, int(shoes_number / 40 +2)):
    page_url = "http://www.pys.com/shoes?p=%d"%i
    shoes_response = requests.get(url=page_url, headers=headers)

    with open(r"E:\python\pythonselfuse\PYSshoes\shoes_page%d.html"%i, "wb") as fp:
        fp.write(shoes_response.text.encode())
        time.sleep(random.uniform(2, 6))






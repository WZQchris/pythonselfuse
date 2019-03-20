# 步骤一：访问登录页面
# 建立Headers字典，get_url
# 利用Requests的get函数抛出请求，验证stats_code == 200，获得response

# 步骤二：模拟登录
# 根据response.cookies获得服务端的cookie
# 新建一个Requests.cookies.RequestsCookieJar对象，并利用该对象的update方法添加cookies
# 对之前的Headers字典进行增删改，建立login_url，login_data字典保存账号密码
# 利用Requests的post函数带入Headers、login_url、login_data、cookies参数，验证response.text["message"] == "登录成功"

# 步骤三：数据查询
# 利用response.Headers["Merchant-Portal-Token"]获得网站唯一识别码，添加至Headers字典
# 建立query_url, query_data字典保存查询数据
# 利用Requests的post函数带入Headers、query_url、query_data、cookies参数，验证stats_code == 200， 获得response

import requests
import json
import time
import datetime as dt


def qiaorong_spider(query_url, username, password, start_date, end_date):
# :parameters :username:        输入用户名
#             :password:        输入对应的密码
#             :start_date:      输入格式应为str = "%Y-%m-%d"
#             :end_date:        输入格式应为str = "%Y-%m-%d"

    get_url = "https://merchant.你懂得.com/"
    get_header = {
        'Host': 'merchant.你懂得.com',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9'
    }
    # 第一次发送请求，获得response headers
    response = requests.get(get_url, get_header)
    # 依据response headers中的“Set-Cookie”信息获取cookies，并作为新的requeset headers中的cookies
    response_cookie = requests.cookies.RequestsCookieJar()
    response_cookie.update(response.cookies)
    # 休眠一段时间，避免请求过快
    time.sleep(10), print("打开**CRM响应状态码: " + str(response.status_code))

    # 第二次发送登录请求，提交用户名、密码，并根据fiddler截取的reques headers进行修改，添加cookies
    login_url = "https://merchant.你懂得.com/user/login/password"
    login_data = {"accountName": username, "password": password}
    get_header["Content-Length"],  get_header["Pragma"], get_header["Origin"], get_header["terminal"], get_header["Content-Type"], get_header["Accept"], \
    get_header["Cache-Control"], get_header["Expires"], get_header["Referer"] = '52', 'no-cache', "https://merchant.你懂得.com", "PC", \
            'application/json;charset=UTF-8', 'application/json, text/plain, */*', 'no-cache', "-1", 'https://merchant.你懂得.com/'
    del get_header['Upgrade-Insecure-Requests']
    login_response = requests.post(url=login_url, data=json.dumps(login_data), cookies=response_cookie, headers=get_header)
    # 依据fiddler截取的response headers 发现新增'merchant-portal-token'，疑似是乔融后台返回的唯一验证字段，需要将其添加至新的request headers
    x = login_response.headers['merchant-portal-token']
    time.sleep(10), print("登录结果反馈: " + str(json.loads(login_response.text)["message"]))

    # 第三次发送数据查询请求，依据设定的时间进行截取
    get_header["Content-Length"], get_header['merchant-portal-token'] = '332', x
    query_form = {"page": 1, "size": 30,
                  "dto": {
                      "orderStatus": None, "name": None, "certNumber": None, "phoneNumber": None, "merchantId": None,
                      "createTimeFrom": start_date, "createTimeTo": end_date, "signTimeFrom": None, "signTimeTo": None, "status": None,
                      "payStatus": None, "contractNumber": None, "auditStatus": None, "subMerchantName": None, "subMerchantNickName": None}}
    query_response = requests.post(url=query_url, data=json.dumps(query_form), headers=get_header, cookies=response_cookie)


    return query_response


day = dt.datetime.now() - dt.timedelta(days=1)
query_url = "https://merchant.你懂得.com/mp/contract/query"
data = {"username": "你懂得", "password": '你懂得', "start_date": "2019-01-01", "end_date": day.strftime("%Y-%m-%d")}


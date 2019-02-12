# -*- coding: utf-8 -*-
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import email as eml
import smtplib as smp
import datetime as dt
day = (dt.datetime.now() - dt.timedelta(days=1)).strftime("%m.%d")

def  _format_addr(s):
    name, addr = eml.utils.parseaddr(s)
    return eml.utils.formataddr((eml.header.Header(name, 'utf-8').encode(), addr))


def sendemail(s_mail, r_mail, title, text_, _path, _attachment_type1, _attachment_type2, _attachment_name, password):
    msg = MIMEMultipart()
    msg['From'] = _format_addr(s_mail)
    msg['To'] = ','.join(r_mail)
    msg['Subject'] = eml.header.Header(title, 'utf-8').encode()
    msg.attach(MIMEText(text_, 'plain', 'utf-8'))
    for i in range(len(_path)):
        with open(_path[i], 'rb') as f:
            mime = MIMEBase(_attachment_type1[i], _attachment_type2[i])#, filename=_attachment_name[i])
            mime.add_header('Content-Disposition', 'attachment', filename=eml.header.Header(_attachment_name[i], 'gbk').encode())
            mime.add_header("Content-ID", "<0>")
            mime.add_header("X-Attachment-Id", "0")
            mime.set_payload(f.read())
            encoders.encode_base64(mime)
            msg.attach(mime)

    recevermail = [eml.utils.parseaddr(i)[1] for i in r_mail]

    server = smp.SMTP_SSL('smtp.qiye.163.com', '994')
    server.set_debuglevel(1)
    server.login('wuzhiqiang@mylike.com', password)
    server.sendmail('wuzhiqiang@mylike.com', recevermail, msg.as_string())
    server.quit()

s_mail='吴智强<wuzhiqiang@mylike.com>'
r_mail = [_format_addr('陈发金<chenfajin@mylike.com>'), _format_addr('李飞跃<lifeiyue@mylike.com>'), _format_addr('陈金云<chenjinyun@mylike.com>'), _format_addr('黄云<huangyun@mylike.com>'),
          _format_addr('陈加鹏<chenjiapeng@mylike.com>'), _format_addr('金倩倩<jinqianqian@mylike.com>'), _format_addr('潘江滢<panjiangying@mylike.com>'), _format_addr('陈碧贞<chenbizhen@mylike.com>'),
          _format_addr('杜春梅<duchunmei@mylike.com>'), _format_addr('缪荣荣<miaorongrong@mylike.com>'), _format_addr('吴泽<wuze@mylike.com>'), _format_addr('钟浩<zhonghao@mylike.com>'), _format_addr('杨帆<yangfan@mylike.com>'),
          _format_addr('周俊<zhoujun@mylike.com>'), _format_addr('汪海疆<wanghaijiang@mylike.com>'), _format_addr('刘志睿<liuzhirui@mylike.com>'), _format_addr('谢宗钰<xiezongyu@mylike.com>'),
          _format_addr('左泽平<zuozeping@mylike.com>'), _format_addr('刘婉瑜<liuwanyu@mylike.com>'),
          _format_addr('汪昊<wanghao@mylike.com>'), _format_addr('俞成杰<yuchengjie@mylike.com>'), _format_addr('元雪<yuanxue@mylike.com>'),
          _format_addr('吴智强<wu.zhiqiang@yexfintech.com>')]
text_ = """\nPS：有任何数据异常、无法查看等问题请及时回复邮件排除故障，谢谢！"""
title = """颐尔信-百度有钱花%s进件汇总"""%day
_path = [r'C:\Users\wuzhiqiang\Desktop\报表数据\颐尔信-有钱花\颐尔信-百度有钱花%s进件汇总.xls'%day,
         r'C:\Users\wuzhiqiang\Desktop\报表数据\颐尔信-有钱花\颐尔信-百度有钱花%s数据图.html'%day,
         r"C:\Users\wuzhiqiang\Desktop\报表数据\颐尔信-乔融\颐尔信-乔融%s进件汇总.xls"%day,
         r"C:\Users\wuzhiqiang\Desktop\报表数据\颐尔信-乔融\颐尔信-乔融%s数据图.html"%day]
_attachment_type1 = ['xls', 'html', 'xls', 'html']
_attachment_type2 = ['xls', 'html', 'xls', 'html']
_attachment_name = ['颐尔信-百度有钱花%s进件汇总.xls'%day, '颐尔信-百度有钱花%s数据图.html'%day, "颐尔信-乔融%s进件汇总.xls"%day, "颐尔信-乔融%s数据图.html"%day]
password = '这是密码'

#sendemail(s_mail, r_mail, title, text_, _path, _attachment_type1, _attachment_type2, _attachment_name, password)



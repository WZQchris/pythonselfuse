# -*- coding: utf-8 -*-
class Gaming:
    
    def __init__(self, name, age, sex, CE):
        self.name = name
        self.age = age
        self.sex = sex
        self.CE = CE
    
    def Fighting(self):
        self.CE -= 200
        print(self.CE)
    
    def XiuLian(self):
        self.CE += 100
        print(self.CE)
        
    def OnLineGame(self):
        self.CE -= 500
        print(self.CE)

 
role1 = Gaming(u"苍井井", 18, u"女", 1000)
role2 = Gaming(u"东尼木木", 20, u"男", 1800)
role3 = Gaming(u"波多多", 19, u"女", 2500)

role1.Fighting()
role3.OnLineGame()
role1.OnLineGame()
role2.XiuLian()
role2.OnLineGame()

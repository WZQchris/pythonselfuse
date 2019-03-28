# -*- coding: utf-8 -*-
import re
class ShoesRe(object):

    def __init__(self, text):
        self.text = text


    def re_list_all(self):
        parameter_normal = re.compile(
            r"""<li class="item last">\n\s+<a href="http://www.pys.com/.+\n\s+<img id="[a-zA-Z0-9\-]+"\n\s+src="http://[a-zA-Z0-9\/\.\_\-]*"
            \s+alt=.+\n\s+</a>\n\s+<div class="product-info">\n\s+<h2 class="product-name"><a href="http://www.pys.com/[a-zA-Z0-9\-]+" title=".+\s+<div class="[a-zA-Z0-9\-]+">
            \s+<span class="regular-price" id="[a-zA-Z0-9\-]+">\n\s+<span class="price">\$[0-9\.\,]+</span>\s+</span>\s+</div>\s+</div>\s+</li>""")
        product_info_normal = parameter_normal.findall(self.text)

        parameter_box = re.compile(
            r"""<li class="item last">\n\s+<a href="http://www.pys.com/.+\n\s+<img id="[a-zA-Z0-9\-]+"\n\s+src="http://[a-zA-Z0-9\/\.\_\-]*"
            \s+alt=.+\n\s+</a>\n\s+<div class="product-info">\n\s+<h2 class="product-name"><a href="http://www.pys.com/[a-zA-Z0-9\-\/]+" title=".+\s+<div class="[a-zA-Z0-9\-]+">
            \s+<p class="old-price">\s+<span class="price-label">Regular Price:</span>\s+<span class="price" id="old-price-[0-9]+">\s+\$[0-9\.\,]+\s+</span>\s*</p>[.\s]*<p class="special-price">
            \s+<span class="price-label">Special Price</span>\s+<span class="price" id="product-price-[0-9]+">\s+\$[0-9\.\,]+\s+</span>\s+</p>
            \s+<p class="special-price">\s+<span class="price-label save">You Save:</span>\s+<span class="price">[0-9\%]+</span>\s+</p>\s+</div>\s+</div>\s+</li>"""
        )
        product_info_box = parameter_box.findall(self.text)
        product_info_normal.extend(product_info_box)

        return product_info_normal


    def re_img(self):
        parameter = re.compile(r'http://assets.pys.com/media/catalog/product/cache/6/small_image/300x/9df78eab33525d08d6e5fb8d27136e95/.+.jpg')
        shoes_img = parameter.findall(self.text)
        return shoes_img

    def re_name(self):
        parameter = re.compile(r'title=".+?[\(]?.+?[\)]?"')
        shoes_name = parameter.findall(self.text)
        return shoes_name

    def re_price(self):
        parameter = re.compile(r"""<span class="price"\s?[a-zA-Z0-9\"\=\-]*>\s*\$([0-9\.]*)""")     
        shoes_price = parameter.findall(self.text)
        return shoes_price





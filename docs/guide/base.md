## 安装

```html
<!--可以自己去npm查看版本号，修改之-->
<script src="https://cdn.jsdelivr.net/npm/ec-wordcloud@0.0.3/dist/ec-wordcloud.js"></script>
<!--ECWordcloud变为全局变量-->
```

Or

```shell
npm install ec-wordcloud -S
/** 或者推荐 **/
yarn add ec-wordcloud -S
```

```js
import ECWordcloud from 'ec-wordcloud'
```

## 使用
> option更多选项请参考[wordcloud2](https://github.com/timdream/wordcloud2.js/blob/gh-pages/API.md)

```js
const wordcloud = new ECWordcloud(document.querySelector('.wordcloud'));

wordcloud.setOption({
    // ...
    maskImage: 'https://example.com/images/shape.png',     // 提供一张图片（链接方式，支持jpg/png），根据其形状进行词云渲染
    fontSizeFactor: 0.1,                                    // 词云权重系数，默认为0.1
    maxFontSize: 60,                                        // 最大fontSize，用来控制weightFactor，默认60
    minFontSize: 12,                                        // 最小fontSize，用来控制weightFactor，默认12
    tooltip: {
        show: true,                                         // 默认：false
        backgroundColor: 'rgba(0, 0, 0, 0.701961)',         // 默认：'rgba(0, 0, 0, 0.701961)'
        formatter: function(item) {                         // 数据格式化函数，item为list的一项
        }
    },
    data:[{
        name:'测试1',value:11
    },{
        name:'测试2',value:12
    }]
    // ...其余请参考wordcloud2.js
});
```

### 方法

#### resize

```js
wordcloud.resize()
```

### 注意

更好地支持图片形状，注意点：
- 请使用图形为纯黑色的白底图片（格式为jpg/png）；
- 如果形状显示不太完美，请不断调整fontSizeFactor, maxFontSize和minFontSize等参数；
- 其他格式（SVG、base64等）暂不支持，请先转换为图片；
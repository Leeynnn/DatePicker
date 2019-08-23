## DatePicker
适用于移动的日期选择，可设置开始年份、结束年份、默认选中日期等

### 注意！DatePicker日期插件的使用依赖于iScroll5
### 因此在使用DatePicker日期插件前
### 一定要先引入iScroll5.js和DatePicker.css

使用示例：
#### html
#### input id="datePicker"

#### js
#### new DatePicker('#datePicker')

##### DatePicker实例化后
##### 默认年份范围是：今年 至 今年 + 10
##### 默认月份是：当前月份
##### 默认日期是：当前日期
##### 真的很简单

##### DatePicker实例化时接收两个参数
##### 第一个是el，需要绑定的input元素，这是必填的
##### 第二个是options，自定义的配置项，这是选填的

#### options对象的有效值：

#### {
####  beginYear: 1970, // 开始年份
####  endYear: 2100, // 结束年份
####  ymd: '2020-01-01' // 默认选中的年份，注意一定要用 'year-month-date' 这种格式
#### }

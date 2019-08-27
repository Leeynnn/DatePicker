// DatePicker的使用需依赖iScroll5，在使用前引入iScroll5.js和DatePicker.css
(function () {
  // DatePicker类
  var DatePicker = function (el, options) {
    var date = new Date()
    // 全局变量
    this.yearScroller = null // 年scroller实例
    this.monthScroller = null // 月scroller实例
    this.dateScroller = null // 日scroller实例
    this.lastScrollYmd = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() // 上一次滚动到年月日
    this.yearList = [] // 年份数组
    this.monthList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'] // 月份数组
    this.dateList = [] // 日期数组
    // 配置对象默认数据
    this.dateOptions = {
      beginYear: date.getFullYear(), // 开始的年份
      endYear: date.getFullYear() + 10, // 结束的年份
      ymd: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() // 默认选中的日期
    }
    // el是绑定的input框
    // options是自定义的配置对象
    if (!options) {
      options = {}
    }
    this.el = typeof el == 'string' ? document.querySelector(el) : el
    this.beginYear = options.beginYear || this.dateOptions.beginYear
    this.endYear = options.endYear || this.dateOptions.endYear
    this.ymd = options.ymd || this.dateOptions.ymd
    this.lastScrollYmd = options.ymd || this.lastScrollYmd
    this.init()
  }
  DatePicker.prototype = {
    // 初始化方法，会在类实例化的时候调用
    init: function () {
      var self = this
      this.el.onclick = function () {
        self.create()
        self.show()
      }
    },
    // 创造方法，在body底部插入日历模块
    create: function () {
      var self = this
      var DatePicker = document.createElement('div')
      DatePicker.id = 'DatePicker'
      // 模块的HTML代码
      var str =
        '<div class="DatePicker__mask"></div>' +
        '<div class="DatePicker__container">' +
        '<div class="DatePicker__head">' +
        '<div class="DatePicker__head__cancel">取消</div>' +
        '<div class="DatePicker__head__confirm">确定</div>' +
        '</div>' +
        '<div class="DatePicker__body">' +
        '<div class="DatePicker__body__list">' +
        '<div class="DatePicker__body__list__year">' +
        '<div class="DatePicker__body__list__scroller">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="DatePicker__body__list">' +
        '<div class="DatePicker__body__list__month">' +
        '<div class="DatePicker__body__list__scroller">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="DatePicker__body__list">' +
        '<div class="DatePicker__body__list__date">' +
        '<div class="DatePicker__body__list__scroller">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
      DatePicker.innerHTML = str
      DatePicker.ontouchmove = function (e) {
        e.preventDefault()
      }
      // 插入body
      document.body.appendChild(DatePicker)
      this.createYear()
      this.createMonth()
      this.createDate(this.beginYear, 1)
      // 定义模块里的一些事件
      document.querySelector('.DatePicker__mask').onclick = function () {
        self.hide()
      }
      document.querySelector('.DatePicker__head__cancel').onclick = function () {
        self.hide()
      }
      document.querySelector('.DatePicker__head__confirm').onclick = function () {
        self.confirm()
      }
    },
    // 创造年月日scroller
    createScroller: function () {
      var ymd = ''
      var year = ''
      var month = ''
      var date = ''
      if (!this.yearScroller) {
        if (this.ymd) {
          ymd = this.ymd
          this.lastScrollYmd = this.ymd
        }
      } else {
        if (this.el.value) {
          ymd = this.el.value
        } else if (this.lastScrollYmd) {
          ymd = this.lastScrollYmd
        }
      }
      if (ymd) {
        year = ymd.split('-')[0]
        month = ymd.split('-')[1]
        date = ymd.split('-')[2]
      }
      var self = this
      // 实例化年scroller
      self.yearScroller = new IScroll('.DatePicker__body__list__year')
      if (year) {
        self.yearList.forEach(function (item, index) {
          if (parseInt(item) == parseInt(year)) {
            self.yearScroller.scrollTo(0, -index * 34)
          }
        })
      }
      self.yearScroller.on('scrollEnd', function () {
        var y = Math.abs(self.yearScroller.y)
        self.yearScroller.scrollTo(0, -Math.round(y / 34) * 34)
        self.lastScrollYmd = self.getYmd()
        self.createDate(self.getYear(), self.getMonth())
        self.dateScroller.refresh()
      })
      // 实例化月scroller
      self.monthScroller = new IScroll('.DatePicker__body__list__month')
      if (month) {
        self.monthList.forEach(function (item, index) {
          if (parseInt(item) == parseInt(month)) {
            self.monthScroller.scrollTo(0, -index * 34)
          }
        })
      }
      self.monthScroller.on('scrollEnd', function () {
        var y = Math.abs(self.monthScroller.y)
        self.monthScroller.scrollTo(0, -Math.round(y / 34) * 34)
        self.lastScrollYmd = self.getYmd()
        self.createDate(self.getYear(), self.getMonth())
        self.dateScroller.refresh()
      })
      // 实例化日scroller
      self.dateScroller = new IScroll('.DatePicker__body__list__date')
      if (date) {
        self.dateList.forEach(function (item, index) {
          if (parseInt(item) == parseInt(date)) {
            self.dateScroller.scrollTo(0, -index * 34)
          }
        })
      }
      self.dateScroller.on('scrollEnd', function () {
        var y = Math.abs(self.dateScroller.y)
        self.dateScroller.scrollTo(0, -Math.round(y / 34) * 34)
        self.lastScrollYmd = self.getYmd()
      })
    },
    // 创造年模块，插入到对应的位置
    createYear: function () {
      this.yearList = []
      var str = ''
      for (let i = this.beginYear; i <= this.endYear; i++) {
        this.yearList.push(i)
        str += '<div class="DatePicker__body__list__scroller__item">' + i + '</div>'
      }
      document.querySelector('.DatePicker__body__list__year').childNodes[0].innerHTML = str
    },
    // 创造月模块，插入到对应的位置
    createMonth: function () {
      var str = ''
      for (let i = 0; i < this.monthList.length; i++) {
        str += '<div class="DatePicker__body__list__scroller__item">' + this.monthList[i] + '</div>'
      }
      document.querySelector('.DatePicker__body__list__month').childNodes[0].innerHTML = str
    },
    // 创造日模块，插入到对应的位置
    createDate: function (year, month) {
      this.dateList = []
      year = parseInt(year)
      month = parseInt(month)
      var str = ''
      for (let i = 1; i <= this.getTotalDays(year, month); i++) {
        this.dateList.push(this.addZero(i))
        str += '<div class="DatePicker__body__list__scroller__item">' + this.addZero(i) + '</div>'
      }
      document.querySelector('.DatePicker__body__list__date').childNodes[0].innerHTML = str
    },
    // 为小于10的数字前面添加0
    addZero: function (num) {
      if (num < 10) {
        return '0' + num
      }
      return num
    },
    // 点击确定，将日期填入绑定的input内
    confirm: function () {
      this.el.value = this.getYmd()
      this.hide()
    },
    // 获取当月天数
    getTotalDays: function (year, month) {
      var totalDays = 30
      if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
        totalDays = 31
      } else if (month === 4 || month === 6 || month === 9 || month === 11) {
        totalDays = 30
      } else if (month === 2) {
        if ((year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)) {
          totalDays = 29
        } else {
          totalDays = 28
        }
      }
      return totalDays
    },
    // 获取年月日
    getYmd: function () {
      return this.getYear() + '-' + this.getMonth() + '-' + this.getDate()
    },
    // 获取选中的年
    getYear: function () {
      var yearIndex = parseInt(Math.abs(this.yearScroller.y) / 34)
      var year = document.querySelector('.DatePicker__body__list__year').childNodes[0].childNodes[yearIndex].innerText
      return year
    },
    // 获取选中的月
    getMonth: function () {
      var monthIndex = parseInt(Math.abs(this.monthScroller.y) / 34)
      var month = document.querySelector('.DatePicker__body__list__month').childNodes[0].childNodes[monthIndex].innerText
      return month
    },
    // 获取选中的日
    getDate: function () {
      var dateIndex = parseInt(Math.abs(this.dateScroller.y) / 34)
      var date = document.querySelector('.DatePicker__body__list__date').childNodes[0].childNodes[dateIndex].innerText
      return date
    },
    // 显示日历模块
    show: function () {
      document.querySelector('#DatePicker').style.display = 'block'
      setTimeout(function () {
        document.querySelector('.DatePicker__mask').style.opacity = '0.5'
        document.querySelector('.DatePicker__container').style.transform = 'translateY(0)'
      }, 0)
      // 创造年月日scroller
      this.createScroller.call(this)
    },
    // 隐藏日历模块
    hide: function () {
      var self = this
      document.querySelector('.DatePicker__mask').style.opacity = '0'
      document.querySelector('.DatePicker__container').style.transform = 'translateY(100%)'
      setTimeout(function () {
        // document.querySelector('#DatePicker').style.display = 'none'
        document.body.removeChild(document.getElementById('DatePicker'))
      }, 300)
    }
  }
  // 导出DatePicker类
  if (typeof exports !== 'undefined') {
    exports.DatePicker = DatePicker
  } else {
    window.DatePicker = DatePicker
  }
})()
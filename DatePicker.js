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
    this.time = 0 // 上次点击的时间
    // 配置对象默认数据
    this.dateOptions = {
      substitute: '', // input的替身点击元素
      beginYear: date.getFullYear(), // 开始的年份
      beginYmd: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(), // 开始的年月日
      endYear: date.getFullYear() + 10, // 结束的年份
      endYmd: '', // 结束的年月日
      ymd: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(), // 默认选中的日期
      beforeCreate: null, // create方法执行前的自定义函数
      beforeShow: null // show方法执行前的自定义函数
    }
    // el是绑定的input框
    // options是自定义的配置对象
    if (!options) {
      options = {}
    }
    this.el = typeof el == 'string' ? document.querySelector(el) : el
    this.substitute = options.substitute || this.dateOptions.substitute
    this.beginYear = options.beginYear || this.dateOptions.beginYear
    this.beginYmd = options.beginYmd || this.dateOptions.beginYmd
    this.endYear = options.endYear || this.dateOptions.endYear
    this.endYmd = options.endYmd || this.dateOptions.endYmd
    this.ymd = options.ymd || this.dateOptions.ymd
    this.lastScrollYmd = options.ymd || this.lastScrollYmd
    this.beforeCreate = options.beforeCreate || this.dateOptions.beforeCreate
    this.beforeShow = options.beforeShow || this.dateOptions.beforeShow
    this.init()
  }
  DatePicker.prototype = {
    // 初始化方法，会在类实例化的时候调用
    init: function () {
      var self = this
      var dom = this.el
      if (this.substitute) {
        dom = typeof this.substitute == 'string' ? document.querySelector(this.substitute) : this.substitute
      }
      dom.addEventListener('click', function () {
        // 100ms内多次点击
        if (self.stopDoubleClick()) {
          return
        }
        if (self.beforeCreate) {
          if (typeof self.beforeCreate === 'function') {
            self.beforeCreate()
          }
        }
        self.create()
        if (self.beforeShow) {
          if (typeof self.beforeShow === 'function') {
            self.beforeShow()
          }
        }
        self.show()
      })
    },
    // 创造方法，在body底部插入日历模块
    create: function () {
      var self = this
      var DatePicker = document.createElement('div')
      DatePicker.id = 'DatePicker'
      DatePicker.className = 'DatePicker'
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
      var beginYear = this.beginYear
      if (this.beginYmd) {
        beginYear = parseInt(this.beginYmd.split('-')[0])
      }
      var beginMonth = 1
      if (this.beginYmd) {
        if (this.getYear() == parseInt(this.beginYmd.split('-')[0])) {
          beginMonth = parseInt(this.beginYmd.split('-')[1])
        }
      }
      this.createDate(beginYear, beginMonth)
      // 定义模块里的一些事件
      document.querySelector('.DatePicker__mask').addEventListener('click', function () {
        // 100ms内多次点击
        if (self.stopDoubleClick()) {
          return
        }
        self.hide()
      })
      document.querySelector('.DatePicker__head__cancel').addEventListener('click', function () {
        self.hide()
      })
      document.querySelector('.DatePicker__head__confirm').addEventListener('click', function () {
        self.confirm()
      })
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
        var beginYear = this.beginYear
        var endYear = this.endYear
        if (this.beginYmd) {
          beginYear = parseInt(this.beginYmd.split('-')[0])
        }
        if (this.endYmd) {
          endYear = parseInt(this.endYmd.split('-')[0])
        }
        for (let i = beginYear; i <= endYear; i++) {
          if (parseInt(i) == parseInt(year)) {
            self.yearScroller.scrollTo(0, -(i - beginYear) * 34)
          }
        }
      }
      self.yearScroller.on('scrollEnd', function () {
        var y = Math.abs(self.yearScroller.y)
        self.yearScroller.scrollTo(0, -Math.round(y / 34) * 34)
        self.lastScrollYmd = self.getYmd()
        self.createMonth()
        self.monthScroller.refresh()
        self.createDate(self.getYear(), self.getMonth())
        self.dateScroller.refresh()
      })
      // 实例化月scroller
      self.monthScroller = new IScroll('.DatePicker__body__list__month')
      if (month) {
        var beginMonth = 1
        var endMonth = 12
        if (this.beginYmd) {
          if (this.getYear() == parseInt(this.beginYmd.split('-')[0])) {
            beginMonth = parseInt(this.beginYmd.split('-')[1])
          }
        }
        if (this.endYmd) {
          if (this.getYear() == parseInt(this.endYmd.split('-')[0])) {
            endMonth = parseInt(this.endYmd.split('-')[1])
          }
        }
        for (let i = beginMonth; i <= endMonth; i++) {
          if (parseInt(i) == parseInt(month)) {
            self.monthScroller.scrollTo(0, -(i - beginMonth) * 34)
          }
        }
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
        var beginDate = 1
        var endDate = this.getTotalDays(year, month)
        if (this.beginYmd) {
          if (this.getYear() == parseInt(this.beginYmd.split('-')[0]) && this.getMonth() == parseInt(this.beginYmd.split('-')[1])) {
            beginDate = parseInt(this.beginYmd.split('-')[2])
          }
        }
        if (this.endYmd) {
          if (this.getYear() == parseInt(this.endYmd.split('-')[0]) && this.getMonth() == parseInt(this.endYmd.split('-')[1])) {
            endDate = parseInt(this.endYmd.split('-')[2])
          }
        }
        for (let i = beginDate; i <= endDate; i++) {
          if (parseInt(i) == parseInt(date)) {
            self.dateScroller.scrollTo(0, -(i - beginDate) * 34)
          }
        }
      }
      self.dateScroller.on('scrollEnd', function () {
        var y = Math.abs(self.dateScroller.y)
        self.dateScroller.scrollTo(0, -Math.round(y / 34) * 34)
        self.lastScrollYmd = self.getYmd()
      })
    },
    // 创造年模块，插入到对应的位置
    createYear: function () {
      var str = ''
      var beginYear = this.beginYear
      var endYear = this.endYear
      if (this.beginYmd) {
        beginYear = parseInt(this.beginYmd.split('-')[0])
      }
      if (this.endYmd) {
        endYear = parseInt(this.endYmd.split('-')[0])
      }
      for (let i = beginYear; i <= endYear; i++) {
        str += '<div class="DatePicker__body__list__scroller__item">' + i + '</div>'
      }
      document.querySelector('.DatePicker__body__list__year').childNodes[0].innerHTML = str
    },
    // 创造月模块，插入到对应的位置
    createMonth: function () {
      var str = ''
      var beginMonth = 1
      var endMonth = 12
      if (this.beginYmd) {
        if (this.getYear() == parseInt(this.beginYmd.split('-')[0])) {
          beginMonth = parseInt(this.beginYmd.split('-')[1])
        }
      }
      if (this.endYmd) {
        if (this.getYear() == parseInt(this.endYmd.split('-')[0])) {
          endMonth = parseInt(this.endYmd.split('-')[1])
        }
      }
      for (let i = beginMonth; i <= endMonth; i++) {
        str += '<div class="DatePicker__body__list__scroller__item">' + this.addZero(i) + '</div>'
      }
      document.querySelector('.DatePicker__body__list__month').childNodes[0].innerHTML = str
    },
    // 创造日模块，插入到对应的位置
    createDate: function (year, month) {
      year = parseInt(year)
      month = parseInt(month)
      var str = ''
      var beginDate = 1
      var endDate = this.getTotalDays(year, month)
      if (this.beginYmd) {
        if (this.getYear() == parseInt(this.beginYmd.split('-')[0]) && this.getMonth() == parseInt(this.beginYmd.split('-')[1])) {
          beginDate = parseInt(this.beginYmd.split('-')[2])
        }
      }
      if (this.endYmd) {
        if (this.getYear() == parseInt(this.endYmd.split('-')[0]) && this.getMonth() == parseInt(this.endYmd.split('-')[1])) {
          endDate = parseInt(this.endYmd.split('-')[2])
        }
      }
      for (let i = beginDate; i <= endDate; i++) {
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
      if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
        totalDays = 31
      } else if (month == 4 || month == 6 || month == 9 || month == 11) {
        totalDays = 30
      } else if (month == 2) {
        if ((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)) {
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
      if (this.yearScroller) {
        var yearIndex = parseInt(Math.abs(this.yearScroller.y) / 34)
        var year = document.querySelector('.DatePicker__body__list__year').childNodes[0].childNodes[yearIndex].innerText
        return year
      } else {
        if (this.beginYmd) {
          return this.beginYmd.split('-')[0]
        }
        return this.lastScrollYmd.split('-')[0]
      }
    },
    // 获取选中的月
    getMonth: function () {
      if (this.monthScroller) {
        var len = document.querySelector('.DatePicker__body__list__month').childNodes[0].childNodes.length
        var monthIndex = parseInt(Math.abs(this.monthScroller.y) / 34)
        if (monthIndex > len) {
          monthIndex = len - 1
        }
        var month = document.querySelector('.DatePicker__body__list__month').childNodes[0].childNodes[monthIndex].innerText
        return month
      } else {
        if (this.beginYmd) {
          return this.beginYmd.split('-')[1]
        }
        return this.lastScrollYmd.split('-')[1]
      }
    },
    // 获取选中的日
    getDate: function () {
      if (this.dateScroller) {
        var len = document.querySelector('.DatePicker__body__list__date').childNodes[0].childNodes.length
        var dateIndex = parseInt(Math.abs(this.dateScroller.y) / 34)
        if (dateIndex > len) {
          dateIndex = len - 1
        }
        var date = document.querySelector('.DatePicker__body__list__date').childNodes[0].childNodes[dateIndex].innerText
        return date
      } else {
        if (this.beginYmd) {
          return this.beginYmd.split('-')[2]
        }
        return this.lastScrollYmd.split('-')[2]
      }
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
        for (var i = 0; i < document.querySelectorAll('.DatePicker').length; i++) {
          document.querySelectorAll('.DatePicker')[i].remove()
        }
      }, 300)
    },
    // 阻止多次点击
    stopDoubleClick: function () {
      if (this.time) {
        var time = new Date().getTime()
        var oldTime = this.time
        if (time - oldTime < 100) {
          return true
        }
      }
      this.time = new Date().getTime()
    }
  }
  // 导出DatePicker类
  if (typeof exports !== 'undefined') {
    exports.DatePicker = DatePicker
  } else {
    window.DatePicker = DatePicker
  }
})()
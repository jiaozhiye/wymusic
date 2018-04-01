KG.JZY.component.Nav = (function($, win, undefined){
    var ObjProvite = (function(){
        return {
            _setPara: function(options){
                this.navWrapper = options.navWrapper || this.navWrapper;
                this.navSlider = options.navSlider || this.navSlider;
                this.callback = options.callback || this.callback || null;
                if (!this.navWrapper || !this.navSlider){
                    throw new Error('组件传参有误~~~');
                }
                // 导航分类列表
                this.navList = this.navWrapper.getElementsByTagName('li');
                // 当前选中导航索引
                this.curIndex = 0;
            }
        };
    })();
    var Obj = function(options){
        if (this instanceof Obj){
            ObjProvite._setPara.call(this, options);
        } else {
            return new Obj(options);
        }
    };
    Obj.prototype = {
        constructor: Obj,
        install: function(){
            // 初始化导航滑块
            this.setSliderPosition();
            // 绑定事件
            this.bindEvent();
        },
        setSliderPosition: function(){
            $(this.navSlider).css({
                'width': this.navList[this.curIndex].offsetWidth + 'px',
                'transform': 'translateX('+ this.navList[this.curIndex].offsetLeft +'px)'
            });
            $(this.navList[this.curIndex]).addClass('selected').siblings().removeClass('selected');
        },
        bindEvent: function(){
            var _this = this;
            $(this.navWrapper).on('click', 'li', function(ev){
                ev.stopPropagation();
                _this.curIndex = $(this).index();
                _this.setSliderPosition();
                _this.callback && _this.callback(_this.curIndex);
            });
        },
        update: function(options){
            ObjProvite._setPara.call(this, options);
        },
        remove: function(){
            // 有事件，需要解绑事件
            $(this.navWrapper).off('click');
            // 有动态的DOM节点，需要移除节点
            // 释放内存
            for (var attr in this){
                this[attr] = null;
            }
        }
    };
    return Obj;
})(Zepto, this);
KG.JZY.component.Drag = (function($, win, undefined){
    var ObjProvite = (function(){
        return {
            _setPara: function(options){
                this.rangeWrapper = options.rangeWrapper || this.rangeWrapper;
                this.callback = options.callback || this.callback || null;
                if (!this.rangeWrapper){
                    throw new Error('组件传参有误~~~');
                } 
                // 外层容器的宽度
                this.rangeWidth = this.rangeWrapper.offsetWidth;
                // 滑块
                this.slider = this.rangeWrapper.children[1];
                // 滑动轨迹
                this.track = this.rangeWrapper.children[0].firstElementChild;
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
            // 绑定事件
            this.bindEvent();
        },
        bindEvent: function(){
            var _this = this;
            $(this.slider).on('touchstart', function(ev){
                var obj = this;
                // console.log(ev);
                var disX = ev.touches[0].pageX - this.offsetLeft;
                // var disY = ev.touches[0].pageY - this.offsetLeft;
                
                document.ontouchmove = function(ev){
                    var l = ev.touches[0].pageX - disX;
                    // var t = ev.touches[0].pageY - disY;
                    if (l < 0){
                        l = 0;
                    }
                    if (l > _this.rangeWidth){
                        l = _this.rangeWidth;
                    }
                    
                    obj.style.left = l + 'px';
                    _this.track.style.width = l + 'px';

                    // 处理回调
                    _this.callback && _this.callback(l / _this.rangeWidth);
                };

                document.ontouchend = function(){
                    this.ontouchmove = null;
                    this.ontouchend = null;
                };
            });
        },
        setPosition: function(percent){
            var l = percent * this.rangeWidth;
            this.slider.style.left = l + 'px';
            this.track.style.width = l + 'px';
        },
        update: function(options){
            ObjProvite._setPara.call(this, options);
        },
        remove: function(){
            // 有事件，需要解绑事件
            $(this.slider).off('touchstart');
            // 有动态的DOM节点，需要移除节点
            // 释放内存
            for (var attr in this){
                this[attr] = null;
            }
        }
    };
    return Obj;
})(Zepto, this);
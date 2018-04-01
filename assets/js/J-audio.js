KG.JZY.component.Audio = (function($, win, undefined){
    var ObjProvite = (function(){
        return {
            _setPara: function(options){
                this.media = options.media || this.media || null;
                this.songList = options.songList || this.songList || [];
                this.curIndex = options.curIndex || this.curIndex || 0;
                this.playType = options.playType || this.playType || 1;
                this.autoPlay = options.autoPlay || this.autoPlay || false;
                this.callback = options.callback || this.callback || null;

                if (this.songList.length == 0){
                    throw new Error('组件传参有误~~~');
                }
                
                if (!this.media){
                    this.media = document.createElement('audio');
                    document.body.appendChild(this.media);
                } else {
                    this.media = typeof this.media == 'string' ? document.getElementById(dom) : dom;
                }

                // 播放/暂停
                this.isPlay = false;
                // 曲目数量
                this.total = this.songList.length;
                // 当前曲目信息
                this.MusicInfo = {};

                if (this.curIndex < 0){
                    this.curIndex = 0;
                }
                if (this.curIndex > this.total - 1){
                    this.curIndex = this.total - 1;
                }
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
            this.startPlay();
        },
        // 播放器启动方法
        startPlay: function(){
            var _this = this;
            // 当浏览器已加载完当前帧时
            $(this.media).off('loadeddata').on('loadeddata', function(){
                _this._play();
                
                // 执行回调
                _this.callback && _this.callback('start')
            });
            this.media.src = this.songList[this.curIndex].source;
        },
        // 核心播放方法
        _play: function(){
            var _this = this;
            // 查看是否是自动播放
            if (this.autoPlay){
                this.isPlay = !0;
                this.media.play();
            }
            // 播放时间改变
            // $(this.media).off('timeupdate').on('timeupdate', function(){
            //     // 认为是结束了
            //     if (_this.getTotalTime() - _this.getCurrentTime() < 1){
            //         console.log('当前曲目播放完毕！');
            //         _this.mapPlayType();
            //     }
            // });
            // 播放结束
            $(this.media).off('ended').on('ended', function(){
                console.log('当前曲目播放完毕！');
                _this.mapPlayType();
            });
        },
        // 匹配播放模式
        mapPlayType: function(){
            switch (this.playType){
                case 1:
                    if (++this.curIndex > this.total - 1){
                        this.playPause();
                        this.callback && this.callback('ended');
                        return;
                    }
                    break;
                case 2:
                    this.curIndex = this.getRandom(0, this.total - 1);
                    break;
                case 4:
                    this.curIndex++;
                    this.curIndex = this.curIndex > (this.total - 1) ? 0 : this.curIndex;
                    break;
            }
            this.startPlay();
        },
        // 播放/暂停 方法
        playPause: function(callback){
            if (this.isPlay){
                this.media.pause();
                this.isPlay = !1;
            } else {
                this.media.play();
                this.isPlay = !0;
            }
            callback && callback(this.isPlay);
        },
        // 获取当前播放位置
        getCurrentTime: function(){
            return this.media.currentTime || 0;
        },
        // 获取总时长方法
        getTotalTime: function(){
            return this.media.duration || 0;
        },
        // 设置播放位置，即拖动进度条
        setCurrentTime: function(time){
            this.media.currentTime = time;
        },
        playNext: function(){
            if (++this.curIndex > this.total - 1){
                this.curIndex = 0;
            }
            this.startPlay();
        },
        playPrev: function(){
            if (--this.curIndex < 0){
                this.curIndex = this.total - 1;
            }
            this.startPlay();
        },
        // 获取歌曲信息
        getMusicInfo: function(){
            this.MusicInfo.title = this.songList[this.curIndex].name;
            this.MusicInfo.author = this.songList[this.curIndex].author;
            this.MusicInfo.desc = this.songList[this.curIndex].desc;
            this.MusicInfo.imgurl = this.songList[this.curIndex].imgurl;
            return this.MusicInfo;
        },
        // 格式化时间
        formatTime: function(time){
            time = parseInt(time);
			return this.addZero(parseInt(time / 60)) + ':' + this.addZero(time % 60);
        },
        addZero: function(num){
			if (num < 10){
				num = '0' + num;
			}
			return num + '';
        },
        getRandom: function(a, b){
            return Math.floor(Math.random() * (b - a + 1)) + a;
        },
        update: function(options){
            ObjProvite._setPara.call(this, options);
        },
        remove: function(){
            // 有事件，需要解绑事件
            $(this.media).off('loadeddata');
            $(this.media).off('ended');
            // 有动态的DOM节点，需要移除节点
            $(this.media).remove();
            // 释放内存
            for (var attr in this){
                this[attr] = null;
            }
        }
    };
    return Obj;
})(Zepto, this);
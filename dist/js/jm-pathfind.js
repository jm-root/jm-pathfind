var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-core');
}

/**
 * pathfind对象
 * @class  pathfind
 */
(function(){
    jm.pathfind = jm.pathfind || {};
})();


var jm = jm || {};
if (typeof module !== 'undefined' && module.exports) {
    jm = require('jm-core');
}

(function () {
    jm.pathfind.Path = jm.EventEmitter.extend({
        _className: 'path',

        ctor: function (opts) {
            this._super();
            this.length = 0;        //路径长度
            this.points = null;    //路径
            if(opts) this.attr(opts);
        }

    });

})();


var jm = jm || {};
if ((typeof exports !== 'undefined' && typeof module !== 'undefined')) {
    jm = require('jm-core');
}

(function () {
    /**
     * 贝赛尔曲线路径
     * opts.points 路径关键坐标数组例如[{0,0}, {100,200}, {1000,600}]
     * opts.step 步长, 默认125, 决定路径的总点数, length = (points.length - 1) * step
     */
    jm.pathfind.PathBezier = jm.pathfind.Path.extend({
        _className: 'pathBezier',
        _step: 125,

        ctor: function (opts) {
            this.step = this._step;
            this._super(opts);
            this.init();
        },

        init: function () {
            if (!this.points) return;
            this._bezierPoints = this._initBezier(this.points);
            this.length = (this.points.length - 1) * this.step;
        },

        /**
         *
         * @param index
         * @param pos
         * @returns {boolean} false表示没有找到, true表示找到, pos返回位置
         */
        index2Position: function (index, pos) {
            if (index >= this.length){
                pos.x = this.points[this.points.length - 1].x;
                pos.y = this.points[this.points.length - 1].y;
                return false;
            }
            var bezierIndex = parseInt(index / this.step);
            var offsetIndex = 1 - 1 / this.step * (index % this.step);
            pos.x = this._bezierX(offsetIndex, this._bezierPoints[bezierIndex]);
            pos.y = this._bezierY(offsetIndex, this._bezierPoints[bezierIndex]);
            return true;
        },

        //初始化贝兹曲线
        _initBezier: function (path) {
            var originPoint = path;
            var curveList = [];
            var scale = 0.6;//控制点收缩系数 ，经调试0.6较好
            var count = 0;
            var midpoints = [];
            var originCount = originPoint.length;
            if (originCount < 0)
                count = 0;
            else if (originCount < 30)
                count = originCount;
            else
                count = 30;

            //生成中点
            for (var i = 0; i < count; i++) {    //不能改为count-1，否则最后一段就算不到了
                var nexti = (i + 1) % count;
                if (i == (count - 1))
                    nexti = count - 1;//因为不是循环曲线，这里要添加限制
                midpoints[i] = {};
                midpoints[i].x = (originPoint[i].x + originPoint[nexti].x) / 2.0;
                midpoints[i].y = (originPoint[i].y + originPoint[nexti].y) / 2.0;
            }

            //平移中点：如果是开始点和结束点就话就不要平移。
            var extrapoints = [];             //2 * originCount
            for (var i = 0; i < count; i++) {    //不能改为count-1，否则最后一段就算不到了
                var nexti = (i + 1) % count;
                var backi = (i + count - 1) % count;

                if (i == (count - 1))nexti = count - 1;//因为不是循环曲线，这里要添加限制
                if (i == 0)backi = 0;

                var midinmid = {};
                midinmid.x = (midpoints[i].x + midpoints[backi].x) / 2.0;
                midinmid.y = (midpoints[i].y + midpoints[backi].y) / 2.0;
                var offsetx = originPoint[i].x - midinmid.x;
                var offsety = originPoint[i].y - midinmid.y;
                var extraindex = 2 * i;
                if (!extrapoints[extraindex])
                    extrapoints[extraindex] = {};
                extrapoints[extraindex].x = midpoints[backi].x + offsetx;
                extrapoints[extraindex].y = midpoints[backi].y + offsety;
                //朝 originPoint[i]方向收缩
                var addx = (extrapoints[extraindex].x - originPoint[i].x) * scale;
                var addy = (extrapoints[extraindex].y - originPoint[i].y) * scale;
                extrapoints[extraindex].x = originPoint[i].x + addx;
                extrapoints[extraindex].y = originPoint[i].y + addy;

                var extranexti = (extraindex + 1) % (2 * count);
                if (!extrapoints[extranexti])
                    extrapoints[extranexti] = {};
                extrapoints[extranexti].x = midpoints[i].x + offsetx;
                extrapoints[extranexti].y = midpoints[i].y + offsety;
                //朝 originPoint[i]方向收缩
                addx = (extrapoints[extranexti].x - originPoint[i].x) * scale;
                addy = (extrapoints[extranexti].y - originPoint[i].y) * scale;
                extrapoints[extranexti].x = originPoint[i].x + addx;
                extrapoints[extranexti].y = originPoint[i].y + addy;
            }
            //生成4控制点，产生贝塞尔曲线
            //当输入的点数异常是0,for(int i = 0 ;i < (count-1) ; i++)将会产生灾难。所以要添加判断
            var pointNum = count;
            if (count <= 0)pointNum = 0;
            else if (count <= 30)pointNum = count - 1;
            else pointNum = 29;
            for (var i = 0; i < pointNum; i++) {    //这里是取得曲线段，因而count-1 --> pointNum

                var controlPoint = [];
                controlPoint[0] = originPoint[i];
                var extraindex = 2 * i;
                controlPoint[1] = extrapoints[extraindex + 1];
                var extranexti = (extraindex + 2) % (2 * count);
                controlPoint[2] = extrapoints[extranexti];
                var nexti = (i + 1) % count;
                if (i == (count - 1))nexti = count - 1;//因为不是循环曲线，这里要添加限制
                controlPoint[3] = originPoint[nexti];
                curveList.push(controlPoint);
            }
            return curveList;
        },

        _bezierX: function (uu, controlP) {
            var part0 = controlP[0].x * uu * uu * uu;
            var part1 = 3 * controlP[1].x * uu * uu * (1 - uu);
            var part2 = 3 * controlP[2].x * uu * (1 - uu) * (1 - uu);
            var part3 = controlP[3].x * (1 - uu) * (1 - uu) * (1 - uu);
            return part0 + part1 + part2 + part3;
        },

        _bezierY: function (uu, controlP) {
            var part0 = controlP[0].y * uu * uu * uu;
            var part1 = 3 * controlP[1].y * uu * uu * (1 - uu);
            var part2 = 3 * controlP[2].y * uu * (1 - uu) * (1 - uu);
            var part3 = controlP[3].y * (1 - uu) * (1 - uu) * (1 - uu);
            return part0 + part1 + part2 + part3;
        }

    });

    jm.pathfind.pathBezier = function (opts) {
        return new jm.pathfind.PathBezier(opts);
    };

})();

var jm = jm || {};
if ((typeof exports !== 'undefined' && typeof module !== 'undefined')) {
    jm = require('jm-core');
}

(function () {
    /**
     * 点路径
     * opts.points 路径坐标数组例如[{0,0}, {100,200}, {1000,600}]
     */
    jm.pathfind.PathPoint = jm.pathfind.Path.extend({
        _className: 'pathPoint',

        ctor: function (opts) {
            this._super(opts);
            this.init();
        },

        init: function () {
            if (!this.points) return;
            this.length = this.points.length;
        },

        /**
         *
         * @param index
         * @param pos
         * @returns {boolean} false表示没有找到, true表示找到, pos返回位置
         */
        index2Position: function (index, pos) {
            if (index >= this.length){
                pos.x = this.points[this.points.length - 1].x;
                pos.y = this.points[this.points.length - 1].y;
                return false;
            }
            pos.x = this.points[index].x;
            pos.y = this.points[index].y;
            return true;
        }

    });

    jm.pathfind.pathPoint = function (opts) {
        return new jm.pathfind.PathPoint(opts);
    };

})();

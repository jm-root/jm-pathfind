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

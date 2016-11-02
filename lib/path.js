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


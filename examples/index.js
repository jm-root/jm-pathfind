var jm = jm || {};
if ((typeof exports !== 'undefined' && typeof module !== 'undefined')) {
    jm = require('../lib');
}

(function () {

    var logger = jm.logger;
    
    //if(false)
    {
        logger.info('test pathPoint');
        var path = jm.pathfind.pathPoint({
            points: [
                {x:0, y:0},
                {x:100, y:100},
                {x:500, y:300}
            ],
            step: 5
        });

        var pos = {};
        for(var i=0; i<=path.length; i++) {
            if(!path.index2Position(i, pos)){
                logger.info('end');
            }
            logger.info(JSON.stringify(pos));
        };

    }

    //if(false)
    {
        logger.info('test pathBezier');
        var path = jm.pathfind.pathBezier({
            points: [
                {x:0, y:0},
                {x:100, y:100},
                {x:500, y:300}
            ],
            step: 5
        });

        var pos = {};
        for(var i=0; i<=path.length; i++) {
            if(!path.index2Position(i, pos)){
                logger.info('end');
            }
            logger.info(JSON.stringify(pos));
        };

    }

})();

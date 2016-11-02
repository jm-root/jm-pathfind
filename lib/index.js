if ((typeof exports !== 'undefined' && typeof module !== 'undefined')) {
    require('./root');
    require('./path');
    require('./pathPoint');
    require('./pathBezier');
    module.exports = require('jm-core');
}
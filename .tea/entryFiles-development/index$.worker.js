require('./config$');

function success() {
require('../..//app');
require('../../pages/main/main');
require('../../pages/paycharge/paycharge');
require('../../pages/cdxx/cdxx');
require('../../pages/tsjy/tsjy');
require('../../pages/charge/charge');
require('../../pages/tsjy/newtsjy/newtsjy');
require('../../pages/tsjy/tsjymx/tsjymx');
require('../../pages/user/user');
require('../../pages/user/cz/cz');
require('../../pages/user/xfjl/xfjl');
require('../../pages/user/hiscd/hiscd');
require('../../pages/user/hiscd/tkd/tkd');
require('../../pages/user/user-cdjl/user-cdjl');
require('../../pages/user/bindphone/bindphone');
require('../../pages/user/about/about');
require('../../pages/cdsm/cdsm');
require('../../pages/tipview/cdview/cdview');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();

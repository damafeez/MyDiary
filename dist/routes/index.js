'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _diary = require('./diary');

var _diary2 = _interopRequireDefault(_diary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
  res.send('Server is live');
});
router.use(_diary2.default);
exports.default = router;
//# sourceMappingURL=index.js.map
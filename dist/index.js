'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = process.env.PORT || 3030;

var app = (0, _express2.default)();

app.use((0, _cors2.default)()).use(_bodyParser2.default.json()).use(_bodyParser2.default.urlencoded({ extended: true }));

app.use('/api/v1', _routes2.default);

app.listen(PORT, function () {
  return console.log('server is running on port ' + PORT);
});

exports.default = app;
//# sourceMappingURL=index.js.map
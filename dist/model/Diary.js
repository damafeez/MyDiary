'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var diaries = [];

var Diary = function () {
  function Diary(_ref) {
    var title = _ref.title,
        body = _ref.body,
        author = _ref.author;

    _classCallCheck(this, Diary);

    var now = new Date().getTime();
    var random = Math.floor(Math.random() * 1000);
    this.title = title;
    this.body = body;
    this.author = author;
    this.id = Number(now.toString().concat(random));
  }

  _createClass(Diary, [{
    key: 'modify',
    value: function modify(_ref2) {
      var title = _ref2.title,
          body = _ref2.body;

      this.title = title;
      this.body = body;
      return this;
    }
  }], [{
    key: 'save',
    value: function save(diary) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        try {
          if (diary instanceof _this) {
            diaries.push(diary);
            resolve(diary);
          } else {
            throw new Error(diary + ' is not a diary');
          }
        } catch (e) {
          reject(new Error(e));
        }
      });
    }
  }, {
    key: 'findById',
    value: function findById(id) {
      return new Promise(function (resolve, reject) {
        var diary = diaries.find(function (entry) {
          return entry.id === Number(id);
        });
        if (diary) {
          resolve(diary);
        } else {
          reject(new Error('entry not found'));
        }
      });
    }
  }, {
    key: 'findByIdAndUpdate',
    value: function findByIdAndUpdate(id, update) {
      return new Promise(function (resolve, reject) {
        var index = diaries.findIndex(function (entry) {
          return entry.id === Number(id);
        });
        if (index >= 0) {
          resolve(diaries[index].modify(update));
        } else {
          reject(new Error('entry not found'));
        }
      });
    }
  }, {
    key: 'findByIdAndDelete',
    value: function findByIdAndDelete(id) {
      return new Promise(function (resolve, reject) {
        var index = diaries.findIndex(function (entry) {
          return entry.id === Number(id);
        });
        var diary = diaries.find(function (entry) {
          return entry.id === Number(id);
        });
        if (index >= 0) {
          diaries.splice(index, 1);
          resolve(diary);
        } else {
          reject(new Error('entry not found'));
        }
      });
    }
  }, {
    key: 'find',
    value: function find() {
      var condition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      return new Promise(function (resolve) {
        var entries = diaries.filter(function (entry) {
          return condition;
        });
        resolve(entries);
      });
    }
  }]);

  return Diary;
}();

exports.default = Diary;
exports.diaries = diaries;
//# sourceMappingURL=Diary.js.map
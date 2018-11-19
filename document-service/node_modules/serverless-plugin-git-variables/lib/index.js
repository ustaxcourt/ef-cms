'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let _exec = (() => {
  var _ref = (0, _asyncToGenerator3.default)(function* (cmd, options = { timeout: 1000 }) {
    return new _promise2.default(function (resolve, reject) {
      _child_process2.default.exec(cmd, options, function (err, stdout) {
        if (err) {
          reject(err);
        } else {
          resolve(stdout.trim());
        }
      });
    });
  });

  return function _exec(_x) {
    return _ref.apply(this, arguments);
  };
})();

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const GIT_PREFIX = 'git'; // TODO: Consider using nodegit instead
class ServerlessGitVariables {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.resolvedValues = {};
    const delegate = serverless.variables.getValueFromSource.bind(serverless.variables);

    serverless.variables.getValueFromSource = variableString => {
      if (variableString.startsWith(`${GIT_PREFIX}:`)) {
        const variable = variableString.split(`${GIT_PREFIX}:`)[1];
        return this._getValue(variable);
      }

      return delegate(variableString);
    };
    this.hooks = {
      'after:package:initialize': this.exportGitVariables.bind(this),
      'before:offline:start': this.exportGitVariables.bind(this),
      'before:offline:start:init': this.exportGitVariables.bind(this)
    };
  }

  _getValue(variable) {
    var _this = this;

    return (0, _asyncToGenerator3.default)(function* () {
      if (_this.resolvedValues[variable]) {
        return _promise2.default.resolve(_this.resolvedValues[variable]);
      }

      return _this._getValueFromGit(variable);
    })();
  }

  _getValueFromGit(variable) {
    var _this2 = this;

    return (0, _asyncToGenerator3.default)(function* () {
      let value = null;
      switch (variable) {
        case 'describe':
          value = yield _exec('git describe --always');
          break;
        case 'describeLight':
          value = yield _exec('git describe --always --tags');
          break;
        case 'sha1':
          value = yield _exec('git rev-parse --short HEAD');
          break;
        case 'commit':
          value = yield _exec('git rev-parse HEAD');
          break;
        case 'branch':
          value = yield _exec('git rev-parse --abbrev-ref HEAD');
          break;
        case 'message':
          value = yield _exec('git log -1 --pretty=%B');
          break;
        case 'isDirty':
          const writeTree = yield _exec('git write-tree');
          const changes = yield _exec(`git diff-index ${writeTree} --`);
          value = `${changes.length > 0}`;
          break;
        default:
          throw new Error(`Git variable ${variable} is unknown. Candidates are 'describe', 'describeLight', 'sha1', 'commit', 'branch', 'message'`);
      }

      // TODO: Figure out why if I don't log, the deasync promise
      // never resolves. Catching it in the debugger or logging
      // causes it to work fine.
      process.stdout.write('');

      // Cache before returning
      _this2.resolvedValues[variable] = value;
      return value;
    })();
  }

  exportGitVariables() {
    const exportGitVariables = this.serverless.service.custom && this.serverless.service.custom.exportGitVariables;
    if (exportGitVariables === false) {
      return _promise2.default.resolve();
    }

    const promises = this.serverless.service.getAllFunctions().map(functionName => {
      return _promise2.default.all([this._getValue('sha1'), this._getValue('commit'), this._getValue('branch'), this._getValue('isDirty')]).then(([sha1, commit, branch, isDirty]) => {
        const func = this.serverless.service.getFunction(functionName);
        this.exportGitVariable(func, 'GIT_COMMIT_SHORT', sha1);
        this.exportGitVariable(func, 'GIT_COMMIT_LONG', commit);
        this.exportGitVariable(func, 'GIT_BRANCH', branch);
        this.exportGitVariable(func, 'GIT_IS_DIRTY', isDirty);
      });
    });
    return _promise2.default.all(promises);
  }

  exportGitVariable(func, variableName, gitValue) {
    if (!func.environment) {
      func.environment = {};
    }

    if (!func.environment[variableName]) {
      func.environment[variableName] = gitValue;
    }

    if (!func.tags) {
      func.tags = {};
    }

    if (!func.tags[variableName]) {
      func.tags[variableName] = gitValue;
    }
  }
}
exports.default = ServerlessGitVariables;
module.exports = exports['default'];
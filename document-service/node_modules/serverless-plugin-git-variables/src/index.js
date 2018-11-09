// TODO: Consider using nodegit instead
import childProcess from 'child_process'

const GIT_PREFIX = 'git'

async function _exec(cmd, options = { timeout: 1000 }) {
  return new Promise((resolve, reject) => {
    childProcess.exec(cmd, options, (err, stdout) => {
      if (err) {
        reject(err)
      } else {
        resolve(stdout.trim())
      }
    })
  })
}

export default class ServerlessGitVariables {
  constructor(serverless, options) {
    this.serverless = serverless
    this.resolvedValues = {}
    const delegate = serverless.variables.getValueFromSource.bind(serverless.variables)

    serverless.variables.getValueFromSource = (variableString) => {
      if (variableString.startsWith(`${GIT_PREFIX}:`)) {
        const variable = variableString.split(`${GIT_PREFIX}:`)[1]
        return this._getValue(variable)
      }

      return delegate(variableString)
    }
    this.hooks = {
      'after:package:initialize': this.exportGitVariables.bind(this),
      'before:offline:start': this.exportGitVariables.bind(this),
      'before:offline:start:init': this.exportGitVariables.bind(this)
    }
  }

  async _getValue(variable) {
    if (this.resolvedValues[variable]) {
      return Promise.resolve(this.resolvedValues[variable])
    }

    return this._getValueFromGit(variable)
  }

  async _getValueFromGit(variable) {
    let value = null
    switch (variable) {
      case 'describe':
        value = await _exec('git describe --always')
        break
      case 'describeLight':
        value = await _exec('git describe --always --tags')
        break
      case 'sha1':
        value = await _exec('git rev-parse --short HEAD')
        break
      case 'commit':
        value = await _exec('git rev-parse HEAD')
        break
      case 'branch':
        value = await _exec('git rev-parse --abbrev-ref HEAD')
        break
      case 'message':
        value = await _exec('git log -1 --pretty=%B')
        break
      case 'isDirty':
        const writeTree = await _exec('git write-tree')
        const changes = await _exec(`git diff-index ${writeTree} --`)
        value = `${changes.length > 0}`
        break
      default:
        throw new Error(`Git variable ${variable} is unknown. Candidates are 'describe', 'describeLight', 'sha1', 'commit', 'branch', 'message'`)
    }

    // TODO: Figure out why if I don't log, the deasync promise
    // never resolves. Catching it in the debugger or logging
    // causes it to work fine.
    process.stdout.write('')

    // Cache before returning
    this.resolvedValues[variable] = value
    return value
  }

  exportGitVariables() {
    const exportGitVariables = this.serverless.service.custom && this.serverless.service.custom.exportGitVariables
    if (exportGitVariables === false) {
      return Promise.resolve()
    }

    const promises = this.serverless.service.getAllFunctions().map((functionName) => {
      return Promise.all([
        this._getValue('sha1'),
        this._getValue('commit'),
        this._getValue('branch'),
        this._getValue('isDirty')
      ]).then(([sha1, commit, branch, isDirty]) => {
        const func = this.serverless.service.getFunction(functionName)
        this.exportGitVariable(func, 'GIT_COMMIT_SHORT', sha1)
        this.exportGitVariable(func, 'GIT_COMMIT_LONG', commit)
        this.exportGitVariable(func, 'GIT_BRANCH', branch)
        this.exportGitVariable(func, 'GIT_IS_DIRTY', isDirty)
      })
    })
    return Promise.all(promises)
  }

  exportGitVariable(func, variableName, gitValue) {
    if (!func.environment) {
      func.environment = {}
    }

    if (!func.environment[variableName]) {
      func.environment[variableName] = gitValue
    }

    if (!func.tags) {
      func.tags = {}
    }

    if (!func.tags[variableName]) {
      func.tags[variableName] = gitValue
    }
  }
}

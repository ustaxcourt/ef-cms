#!/usr/bin/env groovy

pipeline {

  agent any

  stages {
    stage('init') {
      steps {
        script {
          def scmVars = checkout scm
          env.GIT_PREVIOUS_SUCCESSFUL_COMMIT = scmVars.GIT_PREVIOUS_SUCCESSFUL_COMMIT
        }
      }
    }
    stage('web-client') {
      when {
        expression {
          return checkCommit('web-client')
        }
      }
      steps {
        build 'ef-cms-ui'
      }
    }
    stage('serverless-api') {
      when {
        expression {
          return checkCommit('serverless-api')
        }
      }
      steps {
        build 'ef-cms-api'
      }
    }
  }
}

def checkCommit(folder) {
  def target = null
  if (env.CHANGE_TARGET) {
    target = env.CHANGE_TARGET
  } else {
    target = env.GIT_PREVIOUS_SUCCESSFUL_COMMIT
  }
  def matches = sh(returnStatus:true, script: "git diff --name-only origin/${target} | grep '^${folder}'")
  return !matches
}
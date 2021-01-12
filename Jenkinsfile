pipeline {
    agent { label "node12" }
    options { disableConcurrentBuilds() }
    stages {
        stage("Checkout") {
          steps {
            cleanWs()
            checkout([$class: 'GitSCM', branches: [[name: '$BRANCH_NAME']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '83ff6dc5-45b4-4996-b383-e1f225203f3c', url: 'git@github.com:amilabs/pink-unicorn.git']]])
          }
        }
        stage("Publish") {
          when { tag 'v*' }
          steps {
                script{
                    withCredentials([string(credentialsId: 'amilabs-npm-token', variable: 'NPM_TOKEN')]) {
                      dir("packages/pink-unicorn") {
                        sh "echo //registry.npmjs.org/:_authToken=${env.NPM_TOKEN} > .npmrc"
                        sh "echo email=jenkins@amilabs.pro >> .npmrc"
                        sh "echo always-auth=true >> .npmrc"
                        sh "npm version $TAG_NAME"
                        sh "npm publish"
                      }
                      dir("packages/pink-unicorn-admin") {
                        sh "echo //registry.npmjs.org/:_authToken=${env.NPM_TOKEN} > .npmrc"
                        sh "echo email=jenkins@amilabs.pro >> .npmrc"
                        sh "echo always-auth=true >> .npmrc"
                        sh "npm version $TAG_NAME"
                        sh "npm publish"
                      }
                      dir("packages/pink-unicorn-utils") {
                        sh "echo //registry.npmjs.org/:_authToken=${env.NPM_TOKEN} > .npmrc"
                        sh "echo email=jenkins@amilabs.pro >> .npmrc"
                        sh "echo always-auth=true >> .npmrc"
                        sh "npm version $TAG_NAME"
                        sh "npm publish"
                      }
                    }
                }
          }
        }
    }
}
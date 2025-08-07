pipeline {
  agent any

  tools {
    nodejs 'node18'
  }

  environment {
    CI = 'true'
  }

  stages {
    stage('Checkout code') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        bat 'npm install'
      }
    }

    stage('Run tests') {
      steps {
        bat 'npm test'
      }
    }
  }
}

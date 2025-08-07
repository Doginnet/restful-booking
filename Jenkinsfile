pipeline {
  agent 'any' // если есть Jenkins-нода с Linux (или просто 'any', если одна нода)

  tools {
    nodejs 'node18' // Укажем позже в Jenkins настройки
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
        sh 'npm install'
      }
    }

    stage('Fix permissions (optional)') {
      when {
        expression { isUnix() }
      }
      steps {
        sh 'chmod +x node_modules/.bin/*'
      }
    }

    stage('Run tests') {
      steps {
        sh 'npm test'
      }
    }
  }
}

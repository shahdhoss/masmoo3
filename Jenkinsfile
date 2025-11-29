pipeline {
    agent any
    stages {
        stage('Stage 1') {
            steps {
                echo 'Hello world!'
            }
        }
        stage('Install dependencies and build') {
            steps {
                dir('web-app/server') {
                    bat 'npm install'
                    bat 'npm run'
                }
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('MySonarQubeServer'){
                    bat 'sonar-scanner'
                }
            }
        }
    }
}
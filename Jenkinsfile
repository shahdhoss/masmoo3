pipeline {
    agent any
    stages {
        stage('Stage 1') {
            steps {
                echo 'Hello world!'
            }
        }
        stage('Cloning repo') {
            steps {
                bat 'git clone https://github.com/shahdhoss/masmoo3.git'
            }
        }
        stage('Install dependencies and build') {
            steps {
                dir('web-app/server') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }
    }
}
pipeline {
    agent any

    stages {
        stage('Checkout Code') {
        steps {
            git branch: 'main', url:
            "https://github.com/USERNAME/microblog.git"
            }
        }

        stage('Install Dependencies') {
            steps {
            sh '''
            python3 -m venv venv
            . venv/bin/activate
            pip install -r requirements.txt

            '''
            }
        }

        stage(&#39;Lint &amp; Static Analysis&#39;) {
            steps {
            sh '''
            . venv/bin/activate
            pylint app --exit-zero
            bandit -r app
            '''
            }
        }

        stage('Unit Tests') {
            steps {
            '''
            . venv/bin/activate
            pytest --cov=app --cov-report=xml
            '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('MySonarQubeServer') {
                sh 'sonar-scanner'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 2, unit: &#39;MINUTES&#39;) {
                waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Package Application') {
            steps {
            sh 'zip -r artifact.zip app/'
            }
        }
    }
}
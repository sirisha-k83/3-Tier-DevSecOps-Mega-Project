pipeline {
    agent any
    stages {
        stage('Test SonarQube Connection') {
            steps {
                withSonarQubeEnv('MySonarServer') {
                    sh 'echo "SonarQube connection successful!"'
                }
            }
        }
    }
}

pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        SONARQUBE_SERVER = 'MySonarServer'
        SONAR_PROJECT_KEY = '3-Tier-DevopsShack'
        SONAR_PROJECT_NAME = '3-Tier-DevopsShack'
    }

    stages {

        stage('Checkout') {
            steps {
                // Ensure the branch name matches the primary branch of your GitHub repo
                git branch: 'master', url: 'https://github.com/sirisha-k83/3-Tier-DevSecOps-Mega-Project.git'
            }
        }

        stage('Set Environment Variables') {
            steps {
                script {
                    env.COMMIT_SHA = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                    env.DOCKER_IMAGE_NAME = "myapp"
                    env.DOCKER_IMAGE = "${env.DOCKER_IMAGE_NAME}:${env.COMMIT_SHA}"
                }
            }
        }

        // --- Install Dependencies ---
        stage('Install Dependencies') {
            steps {
                // Use the nodejs wrapper and the exact tool name configured in Jenkins Tools
                nodejs('NodeJS 22.0.0') {
                    dir('client') {
                        sh 'npm install'
                    }
                } // <-- Correctly closed nodejs block
            }
        }

        // --- SonarQube Analysis ---
        stage('SonarQube Analysis') {
            steps {
                tool 'Sonar_Scanner'
                // 1. Use withCredentials to retrieve the Secret Text token safely
                withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_LOGIN_TOKEN')]) {
                    // 2. Use withSonarQubeEnv to set server URL and path for the scanner
                    withSonarQubeEnv("${SONARQUBE_SERVER}") {
                        sh """
                            # Call sonar-scanner (which is now on the PATH)
                            sonar-scanner \
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                            -Dsonar.projectName=${SONAR_PROJECT_NAME} \
                            -Dsonar.sources=client \
                            -Dsonar.login=${SONAR_LOGIN_TOKEN}
                        """
                    }
                }
            }
        }

        // --- Quality Gate Check ---
        stage('Quality Gate Check') {
            steps {
                script {
                    // Wait for the SonarQube analysis to complete and check the Quality Gate status
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished for commit ${env.COMMIT_SHA}"
        }
    }
}

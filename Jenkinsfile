pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        // NOTE: Credentials MUST be removed from here.
        SONARQUBE_SERVER = 'MySonarServer'
        SONAR_PROJECT_KEY = '3-Tier-DevopsShack'
        SONAR_PROJECT_NAME = '3-Tier-DevopsShack'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/sirisha-k83/3-Tier-DevSecOps-Mega-Project.git'
            }
        }

        // --- Stage to calculate variables (optional, but clean) ---
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
                // Simpler, correct way to load the Node.js tool (Must match name in Jenkins Tools)
                nodejs('NodeJS 22.0.0') {
                dir('client') {
                    sh 'npm install'
                }
            }
        }

        // --- SonarQube Analysis ---
        stage('SonarQube Analysis') {
            steps {
                // 1. Use withCredentials to retrieve the token safely (Fixes Fatal Error)
                withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_LOGIN_TOKEN')]) {
                    // 2. Use withSonarQubeEnv to set server URL and authentication for the scanner
                    withSonarQubeEnv("${SONARQUBE_SERVER}") {
                        sh """
                            # Scanner is now on PATH, no need for ${scannerHome}
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
                    // This relies on the SonarQube server being correctly configured in Jenkins
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

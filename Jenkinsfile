pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        SONARQUBE_SERVER = 'MySonarServer' // Name configured in Jenkins global settings
        SONAR_PROJECT_KEY = '3-Tier-DevopsShack'
        SONAR_PROJECT_NAME = '3-Tier-DevopsShack'
    }

    stages {

        // --- 1. Checkout 📦 ---
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/sirisha-k83/3-Tier-DevSecOps-Mega-Project.git'
            }
        }

        // --- 2. Set Environment Variables 🧩 ---
        stage('Set Environment Variables') {
            steps {
                script {
                    env.COMMIT_SHA = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                    env.DOCKER_IMAGE_NAME = "myapp"
                    env.DOCKER_IMAGE = "${env.DOCKER_IMAGE_NAME}:${env.COMMIT_SHA}"
                }
            }
        }

        // --- 3. Install Dependencies 📥 ---
        stage('Install Dependencies') {
            steps {
                script {
                    def nodeHome = tool name: 'NodeJS 22.0.0', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
                    env.PATH = "${nodeHome}/bin:${env.PATH}"
                }
                dir('client') {
                    sh 'npm install'
                }
            }
        }

        // --- 4. SonarQube Analysis 🔍 ---
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv("${SONARQUBE_SERVER}") {
                    script {
                        def scannerHome = tool 'Sonar_Scanner'
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                            -Dsonar.projectName=${SONAR_PROJECT_NAME} \
                            -Dsonar.sources=. \
                            -Dsonar.login=${SONAR_TOKEN}
                        """
                    }
                }
            }
        }

        // --- 5. Quality Gate Check ✅ ---
        stage('Quality Gate Check') {
            steps {
                script {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}

pipeline {
    agent any

    triggers {
        githubPush()
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

        stage('SonarQube Analysis') {
    steps {
        withSonarQubeEnv('MySonarServer') { // Use the name of your SonarQube server in Jenkins global config
            script {
                def scannerHome = tool 'Sonar_Scanner'
                sh """
                    ${scannerHome}/bin/sonar-scanner \
                    -Dsonar.projectKey=3-Tier-DevopsShack \
                    -Dsonar.projectName=3-Tier-DevopsShack \
                    -Dsonar.sources=. \
                    -Dsonar.login=${SONAR_TOKEN}
                """
            }
        }

        // --- 5. Quality Gate Check (Using Jenkins Plugin) ⏱️ ---
        stage("Quality Gate Check") {
            steps {
                script {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}

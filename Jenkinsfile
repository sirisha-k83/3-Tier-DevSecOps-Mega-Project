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

        // --- 4. SonarQube Analysis (Using Docker) 🛡️ ---
        stage('SonarQube Analysis') {
            steps {
                withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        docker run --rm \
                        -e SONAR_HOST_URL="http://4.246.109.74:9000" \
                        -e SONAR_LOGIN="$SONAR_TOKEN" \
                        -v "$(pwd):/usr/src" \
                        sonarsource/sonar-scanner-cli \
                        -Dsonar.projectName="3-Tier-DevopsShack" \
                        -Dsonar.projectKey="3-Tier-DevopsShack"
                    '''
                }
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

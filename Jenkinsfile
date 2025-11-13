pipeline {
    agent any

    environment {
        // Use the commit SHA for a unique, immutable tag
        COMMIT_SHA = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
        DOCKER_IMAGE_NAME = "myapp"
        // Use the unique commit SHA for the image tag
        DOCKER_IMAGE = "${DOCKER_IMAGE_NAME}:${COMMIT_SHA}"
        // Removed SCANNER_HOME = tool 'SonarQube Scanner' since you are using Docker for the scanner.
    }

    triggers {
        githubPush()
    }

    stages { // START of stages block

        // --- 1. Checkout 📦 ---
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/sirisha-k83/3-Tier-DevSecOps-Mega-Project.git'
            }
        }

        // --- 2. Install Dependencies 📥 ---
        stage('Install Dependencies') {
            steps {
                tool 'Node_LTS'
                sh 'npm install'
            }
        }

        // --- 3. SonarQube Analysis (Using Docker) 🛡️ ---
        stage('SonarQube Analysis') {
            steps {
                // 1. Fetch the token securely
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

        // --- 4. Quality Gate Check (Using Jenkins Plugin) ⏱️ ---
        stage("Quality Gate Check") {
            steps {
                script {
                    // This is the correct, simple method IF the Jenkins SonarQube plugin 
                    // is configured globally with the correct server URL.
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        
        // Note: The manual 'sh timeout' stage for quality gate was removed as it conflicts with 'waitForQualityGate'.

    } // END of stages block
} // END of pipeline block

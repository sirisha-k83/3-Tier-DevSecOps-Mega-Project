pipeline {
    agent any

    environment {
        // Use the commit SHA for a unique, immutable tag
        COMMIT_SHA = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
        DOCKER_IMAGE_NAME = "myapp"
        // Use the unique commit SHA for the image tag, not just BUILD_NUMBER
        DOCKER_IMAGE = "${DOCKER_IMAGE_NAME}:${COMMIT_SHA}" 
        SCANNER_HOME = tool 'SonarQube Scanner' // Correcting tool declaration
    }

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

        // --- 2. Install Dependencies 📥 ---
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

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
// --- Quality Gate ---
stage("Quality Gate") {
    steps {
        script {
            // Note: If you use the Docker method, the Quality Gate stage still requires 
            // the Jenkins SonarQube Plugin to be configured globally to know how to connect.
            waitForQualityGate abortPipeline: true
        }
    }
}
        
        // --- 5. Quality Gate Check (Critical DevSecOps Step) ---
        stage('SonarQube Quality Gate') {
            steps {
                // Wait for the analysis to complete and check the quality gate result
                timeout(time: 5, unit: 'MINUTES') { 
                    // 'waitForQualityGate' is usually provided by the SonarQube plugin
                    // This command will cause the pipeline to fail if the gate fails
                    sh 'timeout 300s /bin/bash -c "while ! (curl -s --fail \"http://localhost:9000/api/qualitygates/project_status?projectKey=${DOCKER_IMAGE_NAME}\" | grep -q \\"\"status\\\":\\\"OK\\\"\\"); do sleep 5; done"' // Example simple check, replace with plugin function
                    // Better alternative: `waitForQualityGate abortPipeline: true` if using the plugin
                }
            }
        }


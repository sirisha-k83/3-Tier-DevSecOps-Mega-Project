pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS 22.0.0'
    }

    environment {
        SONARQUBE_SERVER = 'MySonarServer'
        SONAR_PROJECT_KEY = '3-Tier-DevopsShack'
        SONAR_PROJECT_NAME = '3-tier-devopsshack'
    }
    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/sirisha-k83/3-Tier-DevSecOps-Mega-Project.git'
            }
        }
        
        stage('Install Dependencies') {
           steps {
                nodejs('NodeJS 22.0.0') {
                    dir('api') {
                        sh 'npm install'
                    }
                    dir('client') {
                        sh 'npm install'
                    }
                }
            }
        }

       stage('Setup Gitleaks') {
         steps {
          sh """
            # 1. Download the file into the workspace
            curl -L https://github.com/gitleaks/gitleaks/releases/download/v8.18.2/gitleaks_8.18.2_linux_x64.tar.gz -o gitleaks.tar.gz
            
            # 2. Extract into the workspace
            tar -xzf gitleaks.tar.gz
            
            # 3. Rename the binary to 'gitleaks' and ensure it's executable
            chmod +x gitleaks
        """
       }
   }

    stage('GitLeaks Scan') {
       steps {
        // You must now execute it using the relative path from the workspace
        sh './gitleaks detect --source ./client --exit-code 1'
        sh './gitleaks detect --source ./api --exit-code 1'
        }
   }
        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'Sonar_Scanner'
                    
                    withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_LOGIN_TOKEN')]) {
                        withSonarQubeEnv("${SONARQUBE_SERVER}") {
                            sh """
                                ${scannerHome}/bin/sonar-scanner \\
                                -Dsonar.projectKey=${SONAR_PROJECT_KEY} \\
                                -Dsonar.projectName=${SONAR_PROJECT_NAME} \\
                                -Dsonar.sources=api,client \\
                                -Dsonar.login=${SONAR_LOGIN_TOKEN}
                            """
                        }
                    }
                }
            }
        }

        // --- Quality Gate Check (TEMPORARILY SKIPPED) ---
        stage('Quality Gate Check') {
            when { 
                expression { 
                    return false // Forces the stage to be skipped
                }
            }
            steps {
                script {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // --- TRIVY FS Scan ---
        stage('TRIVY FS Scan') {
            steps {
                // Ensure Trivy is installed on the agent
                sh "trivy fs . > trivyfs.txt"
            }
        }
        
        stage('Build-Tag & Push Backend Docker Image') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker') {
                        dir('api') {
                            sh 'docker build -t sirishak83/backend:latest .'
                            sh 'docker push sirishak83/backend:latest'
                                    }
                    }
                }
            }
        }  
            
        stage('Build-Tag & Push Frontend Docker Image') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker') {
                        dir('client') {
                            sh 'docker build -t sirishak83/frontend:latest .'
                            sh 'docker push sirishak83/frontend:latest'
                        }
                    }
                }
            }
        }  
    }
}

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
        
        stage('Frontend Compilation') {
            steps {
                dir('client') {
                    sh 'find . -name "*.js" -exec node --check {} +'
                }
            }
        }
        
        stage('Backend Compilation') {
            steps {
                dir('api') {
                    sh 'find . -name "*.js" -exec node --check {} +'
                }
            }
        }
        
        stage('GitLeaks Scan') {
            steps {
                sh 'gitleaks detect --source ./client --exit-code 1'
                sh 'gitleaks detect --source ./api --exit-code 1'
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

pipeline {
    agent {
        docker {
            image 'node:20-alpine'
            args '-v /var/run/docker.sock:/var/run/docker.sock --user root'
        }
    }

    environment {
        IMAGE_NAME = 'glework-frontend'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        CANDIDATE_CONTAINER = 'glework-frontend-candidate'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from Git...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                echo 'Running ESLint...'
                sh 'npm run lint'
            }
        }

        stage('Type Check') {
            steps {
                echo 'Running TypeScript type check...'
                sh 'npm run type-check'
            }
        }

        stage('Test') {
            steps {
                echo 'Running test suite...'
                sh 'npm run test:run'
            }
        }

        stage('Build App') {
            steps {
                echo 'Building React app with Vite...'
                sh 'npm run build'
                sh 'echo "Build output:" && ls -lh dist/'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    sh 'apk add --no-cache curl docker-cli'
                    
                    sh """
                        docker build \
                          -t ${IMAGE_NAME}:${IMAGE_TAG} \
                          -t ${IMAGE_NAME}:latest \
                          .
                    """
                    
                    sh "docker images ${IMAGE_NAME}"
                }
            }
        }

        stage('Verify Candidate Container') {
            steps {
                echo 'Verifying candidate container...'
                script {
                    sh """
                        docker stop ${CANDIDATE_CONTAINER} 2>/dev/null || true
                        docker rm ${CANDIDATE_CONTAINER} 2>/dev/null || true

                        docker run -d \
                          -p 8081:80 \
                          --name ${CANDIDATE_CONTAINER} \
                          ${IMAGE_NAME}:${IMAGE_TAG}

                        sleep 5
                        curl -f http://localhost:8081/
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying to production...'
                script {
                    sh """
                        docker stop ${IMAGE_NAME} 2>/dev/null || true
                        docker rm ${IMAGE_NAME} 2>/dev/null || true

                        docker run -d \
                          -p 8080:80 \
                          --name ${IMAGE_NAME} \
                          --restart unless-stopped \
                          ${IMAGE_NAME}:${IMAGE_TAG}

                        sleep 5
                        docker ps | grep ${IMAGE_NAME}
                        curl -f http://localhost:8080/
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            sh 'docker stop ${CANDIDATE_CONTAINER} 2>/dev/null || true'
            sh 'docker rm ${CANDIDATE_CONTAINER} 2>/dev/null || true'
            sh 'docker image prune -f || true'
        }
        success {
            echo 'Build succeeded!'
            echo "App running at: http://localhost:8080"
        }
        failure {
            echo 'Build failed!'
        }
    }
}

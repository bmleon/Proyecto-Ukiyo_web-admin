pipeline {
    agent any

    environment {
        // Tus datos de Docker Hub
        DOCKER_USER = 'bmleon'
        IMAGE_NAME = 'ukiyo-admin'
        
        // Llamamos a la "caja fuerte" de Jenkins que creaste antes
        DOCKER_CREDS = credentials('docker-hub-creds')
    }

    stages {
        stage('Construir (Build)') {
            steps {
                echo 'Empaquetando la aplicación Nuxt...'
                sh 'docker build -t ${DOCKER_USER}/${IMAGE_NAME}:latest .'
            }
        }

        stage('Subir (Push)') {
            steps {
                echo 'Iniciando sesión en Docker Hub de forma segura...'
                sh 'echo $DOCKER_CREDS_PSW | docker login -u $DOCKER_CREDS_USR --password-stdin'
                
                echo 'Subiendo la nueva imagen a la nube...'
                sh 'docker push ${DOCKER_USER}/${IMAGE_NAME}:latest'
            }
        }

        stage('Desplegar (Deploy)') {
            steps {
                echo 'Avisando a Kubernetes para que se actualice...'
                // OJO: Aquí asumo que tu deployment en Kubernetes se llama "ukiyo-admin"
                sh 'kubectl rollout restart deployment ukiyo-admin'
            }
        }
    }
}
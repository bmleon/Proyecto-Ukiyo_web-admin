pipeline {
    agent any

    environment {
        // Definimos la imagen para no repetir código
        DOCKER_IMAGE = "bmleon/miportfolio:latest"
        DOCKER_FILE  = "Docker/proyectos/mi_Portfolio/deploy/Dockerfile"
    }

    stages {
        stage('Limpiar Espacio') {
            steps {
                script {
                    echo "Limpiando imágenes antiguas para ahorrar espacio..."
                    // El 'true' evita que el pipeline falle si no hay nada que limpiar
                    sh "docker system prune -f || true"
                }
            }
        }

        stage('Construir Imagen') {
            steps {
                script {
                    echo "Construyendo la imagen: ${DOCKER_IMAGE}"
                    // Usamos el punto (.) al final para indicar el contexto actual
                    sh "docker build -t ${DOCKER_IMAGE} -f ${DOCKER_FILE} ."
                }
            }
        }

        stage('Subir a Docker Hub') {
            steps {
                script {
                    echo "Iniciando sesión en Docker Hub..."
                    // Requiere que hayas creado la credencial 'docker-hub-credentials' en Jenkins
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', 
                                                    passwordVariable: 'DOCKER_HUB_PASSWORD', 
                                                    usernameVariable: 'DOCKER_HUB_USER')]) {
                        sh "echo \$DOCKER_HUB_PASSWORD | docker login -u \$DOCKER_HUB_USER --password-stdin"
                        sh "docker push ${DOCKER_IMAGE}"
                    }
                }
            }
        }

        stage('Desplegar en Kubernetes') {
            steps {
                script {
                    echo "Actualizando el despliegue en el clúster..."
                    // Forzamos el reinicio del pod para que tome la nueva imagen
                    sh "microk8s kubectl rollout restart deployment ukiyo-admin -n default"
                }
            }
        }
    }

    post {
        success {
            echo "¡Éxito! El portfolio se ha desplegado correctamente."
        }
        failure {
            echo "Algo ha fallado. Revisa los logs de la consola superiores."
        }
    }
}
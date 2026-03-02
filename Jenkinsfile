pipeline {
    agent {
        kubernetes {
            yaml '''
            apiVersion: v1
            kind: Pod
            spec:
              containers:
              - name: kaniko
                image: gcr.io/kaniko-project/executor:debug
                command:
                - sleep
                args:
                - 9999999
              - name: kubectl
                image: bitnami/kubectl:latest
                command:
                - sleep
                args:
                - 9999999
            '''
        }
    }

    environment {
        // Tus datos de Docker Hub
        DOCKER_USER = 'bmleon'
        IMAGE_NAME = 'ukiyo-admin'
    }

    stages {
        stage('Construir y Subir a Docker Hub (Kaniko)') {
            steps {
                // Entramos al minitrabajador de Kaniko
                container('kaniko') {
                    // Usamos la credencial que guardaste en Jenkins
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER_VAR')]) {
                        sh '''
                        echo "Configurando credenciales de Docker Hub para Kaniko..."
                        mkdir -p /kaniko/.docker
                        echo "{\\"auths\\":{\\"https://index.docker.io/v1/\\":{\\"username\\":\\"${DOCKER_USER_VAR}\\",\\"password\\":\\"${DOCKER_PASS}\\"}}}" > /kaniko/.docker/config.json

                        echo "Kaniko está construyendo y subiendo la imagen..."
                        /kaniko/executor --context `pwd` --dockerfile `pwd`/Dockerfile --destination ${DOCKER_USER}/${IMAGE_NAME}:latest
                        '''
                    }
                }
            }
        }

        stage('Desplegar en Kubernetes') {
            steps {
                // Entramos al minitrabajador de Kubectl
                container('kubectl') {
                    echo 'Avisando a Kubernetes para actualizar la web...'
                    // Ojo: Asegúrate de que tu deployment en Kubernetes se llama así
                    sh 'kubectl rollout restart deployment ukiyo-admin'
                }
            }
        }
    }
}
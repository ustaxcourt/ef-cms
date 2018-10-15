docker run -ti -v $(pwd):/root/src -f Dockerfile.sonar sonar-scanner \
  -Dsonar.login=admin \
  -Dsonar.password=$SONAR_PASSWORD \
  -Dsonar.host.url=https://$(cd ../management/management/ && terraform output sonarqube_url) \
  -Dsonar.projectBaseDir=./src
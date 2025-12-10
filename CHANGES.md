## Deploy docker container 4.3.59 to the production ECR:
. scripts/env/set-env.zsh prod
npm run deploy:ci-image

scripts/secrets/update-secret.ts --key "ES_ENGINE_VERSION" --value "OpenSearch_3.3"
ENV=account scripts/secrets/update-secret.ts --key "ES_LOGS_ENGINE_VERSION" --value "OpenSearch_3.3"
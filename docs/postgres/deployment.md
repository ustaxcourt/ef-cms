

# Steps to Deploy

1. update the environment secrets (aws secrets manager), to include the following
    - POSTGRES_USER ${ENV}_dawson
    - DATABASE_NAME ${ENV}_dawson
    - POSTGRES_MASTER_USERNAME master
    - POSTGRES_MASTER_PASSWORD ${GENERATE_A_SECURE_PASS}
    - (optional) RDS_MAX_CAPACITY 1
    - (optional) RDS_MIN_CAPACITY 0.5
2. source scripts/env/set-env.zsh ${ENV}
3. npm run deploy:account-specific (to update the necessary circle policies)
4. npm run deploy:allColors ${ENV}
    - this will create the rds cluster with the master username and password
5. create the database users
    - look up rds endpoint for the writer instance
    - cd scripts/postgres && DB_HOST=${REPLACE_WITH_RDS_HOST} ./create-rds-users.sh
6. merge PR into your environment and run a deployment.
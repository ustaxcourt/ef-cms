
1. merge PR into your environment
2. update the environment secrets (aws secrets manager), to include the following
    - POSTGRES_USER ${ENV}_dawson
    - DATABASE_NAME ${ENV}_dawson
    - POSTGRES_MASTER_USERNAME master
    - POSTGRES_MASTER_PASSWORD ${GENERATE_A_SECURE_PASS} # we recommend 32+ character alpha numeric.  special character might mess stuff up
    - (optional) RDS_MAX_CAPACITY 1
    - (optional) RDS_MIN_CAPACITY 0.5
3. source scripts/env/set-env.zsh ${ENV}
4. npm run deploy:account-specific (to update the necessary circle policies)
5. npm run deploy:allColors ${ENV}
    - this will create the rds cluster with the master username and password
6. setup-for-blue-green-migration.sh ${ENV} - we need an alpha - beta migration so messages get moved to rds
7. create the database users
    - look up rds endpoint for the writer instance
    - install psql (brew install libpq)
    - cd scripts/postgres && DB_HOST=${REPLACE_WITH_RDS_HOST} ./create-rds-users.sh
8. update the default security groups attached to the rds instance to allow all traffic
    - east - allow traffic from ipv4 0.0.0.0/0
    - east - allow traffic from ipv6 ::/0
    - west - allow traffic from ipv4 0.0.0.0/0
    - west - allow traffic from ipv6 ::/0
9. run a deployment in circle
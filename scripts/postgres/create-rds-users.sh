#!/bin/bash

# set DB_HOST before running on your environment
# source your ENV before running this script with the correct environment.

GENERATED_SQL_FILE="create-users-generated.sql"
sed "s/ENVREPLACEME/${ENV}/g;" create-users.sql > "${GENERATED_SQL_FILE}"
PGPASSWORD="${POSTGRES_MASTER_PASSWORD}" psql -h "${DB_HOST}" -U "${POSTGRES_MASTER_USERNAME}" -d "${DATABASE_NAME}" -f "${GENERATED_SQL_FILE}"
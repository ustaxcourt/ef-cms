#!/bin/bash

# Set variables
REGION="us-east-1"                      # e.g., us-east-1
DB_HOST="tf-20240909164102989400000001.ctjufrxxikdr.us-east-1.rds.amazonaws.com"  # e.g., mydb.cluster-abcdefghijkl.us-east-1.rds.amazonaws.com
DB_PORT=5432                             # Change this if using a different port, e.g., 5432 for PostgreSQL
DB_USER="exp3_dawson"                         # Database user
DB_NAME="exp3_dawson"                    # Database name
SSL_CERT_PATH="global-bundle.pem"     # Path to SSL certificate bundle

# Generate the IAM authentication token
TOKEN=$(aws rds generate-db-auth-token \
    --hostname "$DB_HOST" \
    --port "$DB_PORT" \
    --region "$REGION" \
    --username "$DB_USER")

# Check if the token was generated successfully
if [ -z "$TOKEN" ]; then
    echo "Error: Failed to generate IAM token."
    exit 1
fi

# Output the generated token (optional)
echo "Generated IAM Token:"
echo "$TOKEN"

# Connect to the PostgreSQL instance using psql with the generated token
psql "host=$DB_HOST port=$DB_PORT user=$DB_USER sslmode=verify-full sslrootcert=$SSL_CERT_PATH dbname=$DB_NAME password=$TOKEN"
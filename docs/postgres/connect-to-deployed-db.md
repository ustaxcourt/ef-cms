1. Use environment switcher to point at environment
2. Modify generate-token.sh with environment variables
  - DB_HOST=""  # e.g., mydb.cluster-abcdefghijkl.us-east-1.rds.amazonaws.com. This can be found in aws console
  - DB_USER="${env}_developers"                         # Database user
  - DB_NAME="${env}_dawson"                    # Database name
3. run generate-token.sh
4. Connect to DB using Tables Plus
  - Host/socket is DB_HOST from step 2
  - User is DB_User from step 2
  - password is token generated in step 3
  - database is DB_NAME from step 2
  - SSL mode preferred
  - For SSL keys and select "CA Cert..." and choose the global-bundle.pem file in the root of the ef-cms repo
  - connect
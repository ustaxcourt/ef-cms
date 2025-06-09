# Deleting west infrastructure

## Why we are deleting west infrastructure
- The failover mechanism is not robust enough to be effective. We aren't using west infrastructure effectively.
- Extra costs
- Adds complexity to infrastructure and to database design (more distributed vs. less non-distributed)

## Process
- As part of 10502, we are routing all traffic to us-east-1.
- Afterwards, this frees us to delete us-west-1 infrastructure without affecting the deployed app.
- We call the scripts in this directory--and run other commands in line--in deploy-account-specific.sh, deploy-app-all-colors.sh, and deploy-app-color.sh.
- Deleting us-west-1 infrastructure is a one-time operation. Once it is complete, we should update the above sh scripts.
- We are not deleting all us-west-1 resources. We are keeping backup databases and s3 buckets.

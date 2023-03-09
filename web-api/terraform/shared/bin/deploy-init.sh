#!/bin/bash

ENVIRONMENT=$1
export ENVIRONMENT="${ENVIRONMENT}"

../../../../shared/terraform/bin/init.sh documents
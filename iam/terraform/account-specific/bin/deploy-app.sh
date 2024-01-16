#!/bin/bash -e

# shellcheck disable=SC1091 # this file does exist, we promise
source ../bin/deploy-init.sh

terraform apply

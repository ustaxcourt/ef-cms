#!/bin/bash

# This script waits for different services to come online before returning

# Usage
#   wait-until-services.sh

# Requirements
#   - curl must be installed on your machine

./wait-until.sh http://localhost:4000/ 404

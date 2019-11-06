#!/bin/bash -e	
set -e	
docker pull amazonlinux:2	
docker run --rm -ti -v "$(pwd)/runtimes/clamav:/opt/app" amazonlinux:2 /bin/bash -c 'cd /opt/app && chmod +x ./build.sh && ./build.sh'
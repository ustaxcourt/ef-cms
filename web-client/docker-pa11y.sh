#!/bin/bash -e
docker build -t web-client-build -f ../Dockerfile ..
docker run --rm web-client-build /bin/sh -c 'cd web-api && (npm start &) && cd ../web-client && (npm run dev &) && ../wait-until.sh http://localhost:1234 && ../wait-until.sh http://localhost:3000 && npm run test:pa11y'
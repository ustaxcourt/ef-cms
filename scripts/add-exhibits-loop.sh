#!/bin/bash
for i in {1..60}; do
  echo "Run $i/60"
  API_URL=https://api-blue.test.ef-cms.ustaxcourt.gov DEFAULT_ACCOUNT_PASS="" ./scripts/add-exhibits-to-case.ts -d 16017-21 -e 100
done

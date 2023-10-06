#!/bin/bash

# this script can be ran locally to create 1000 messages
# from the ADC user sent back to themself.
# used to test performance of our react app

for i in {1..1000}
do
  echo ""
  echo "$((i + 1)) message created"
  curl 'http://localhost:4000/messages/' \
    -H 'Accept: application/json, text/plain, */*' \
    -H 'Accept-Language: en-US,en;q=0.9' \
    -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkY0BleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IEFEQyIsInVzZXJJZCI6IjY4MDVkMWFiLTE4ZDAtNDNlYy1iYWZiLTY1NGU4MzQwNTQxNiIsImN1c3RvbTpyb2xlIjoiYWRjIiwic3ViIjoiNjgwNWQxYWItMThkMC00M2VjLWJhZmItNjU0ZTgzNDA1NDE2IiwiaWF0IjoxNjUzNTczMjc3fQ.qkO5KfxDKYYl5293EehqvooBr_Ot8v7PQ24hzsnI6tA' \
    -H 'Cache-Control: no-cache' \
    -H 'Connection: keep-alive' \
    -H 'Content-Type: application/json' \
    -H 'Origin: http://localhost:1234' \
    -H 'Pragma: no-cache' \
    -H 'Referer: http://localhost:1234/' \
    -H 'Sec-Fetch-Dest: empty' \
    -H 'Sec-Fetch-Mode: cors' \
    -H 'Sec-Fetch-Site: same-site' \
    -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36' \
    -H 'dnt: 1' \
    -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"' \
    -H 'sec-ch-ua-mobile: ?0' \
    -H 'sec-ch-ua-platform: "macOS"' \
    --data-raw '{"attachments":[{"documentId":"596223c1-527b-46b4-98b0-1b10455e9495","documentTitle":"Petition"}],"docketNumber":"104-20","message":"asdf","subject":"Petition","toSection":"adc","toUserId":"6805d1ab-18d0-43ec-bafb-654e83405416"}' \
    --compressed
done
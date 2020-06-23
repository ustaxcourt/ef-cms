#!/bin/bash -e

BEARER_AUTH="Bearer petitioner"
echo "$BEARER_AUTH"

echo "----> Building prop file:"
cat > auth.prop <<EOF
replacer.full_list(0).description=auth1
replacer.full_list(0).enabled=true
replacer.full_list(0).matchtype=REQ_HEADER
replacer.full_list(0).matchstr=Authorization
replacer.full_list(0).regex=false
replacer.full_list(0).replacement=$BEARER_AUTH
EOF

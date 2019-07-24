BEARER_AUTH="Bearer taxpayer"
echo $BEARER_AUTH

echo "----> Building prop file:"
echo  "replacer.full_list(0).description=auth1" >> auth.prop
echo  "replacer.full_list(0).enabled=true" >> auth.prop
echo  "replacer.full_list(0).matchtype=REQ_HEADER" >> auth.prop
echo  "replacer.full_list(0).matchstr=Authorization" >> auth.prop
echo  "replacer.full_list(0).regex=false" >> auth.prop
echo  "replacer.full_list(0).replacement=$BEARER_AUTH" >> auth.prop
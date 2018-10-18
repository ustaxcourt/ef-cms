DIFFS=$(git diff --name-only origin/develop)
GREP=$(echo $DIFFS | grep serverless-api)
WC=$(echo $GREP | wc -l)
# COUNT=$(git diff --name-only origin/develop | grep serverless-api | wc -l)
if [ $WC == "0" ] ; then
  echo "No changes detected inside the serverless-api folder; exiting ending the pipeline";
  exit 1;
fi

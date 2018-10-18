COUNT=$(git diff --name-only develop | grep serverless-api | wc -l)
if [ $COUNT == "0" ] ; then
  echo "No changes detected inside the serverless-api folder; exiting ending the pipeline";
  exit 1;
fi

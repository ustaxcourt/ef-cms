#!/bin/bash

AVERAGE_THRESHOLD=10

# wait an initial 5 minutes for the reindex to start
sleep 300

exit_on_finished() {
  # get the past 15 minutes of history
  start=$(node -e 'var d = new Date(); d.setTime(d.getTime() - (60 * 1000 * 15)); console.log(d.toISOString())')
  end=$(node -e 'var d = new Date(); d.setTime(d.getTime()); console.log(d.toISOString())')
  lambda="streams_$ENV_$DEPLOYING_COLOR"
  invocations=$(aws cloudwatch get-metric-statistics --metric-name Invocations --namespace AWS/Lambda --statistics Sum --start-time $start --end-time $end --period 60 --dimensions Name=FunctionName,Value=$lambda --output=text --region us-east-1 | sort -k 3 | awk '{print $2}')
  average=`echo $invocations | jq -s add/length`
  averageCount=$(printf "%.0f\n" $average)
  if [ $averageCount -ge $AVERAGE_THRESHOLD ]; then
    echo "re-index completed"
    exit 0;
  fi
}

while true
do
  exit_on_finished
  echo "re-index still processing, sleeping for 5 minutes to check again."
  sleep 300
done

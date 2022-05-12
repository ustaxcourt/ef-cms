const AWS = require('aws-sdk');

const check = (value, message) => {
  if (!value) {
    console.log(message);
    process.exit(1);
  }
};

const { AWS_ACCOUNT_ID, CURRENT_COLOR, DEPLOYING_COLOR, EFCMS_DOMAIN, ENV } =
  process.env;

check(CURRENT_COLOR, 'You must have DEPLOYING_COLOR set in your environment');
check(DEPLOYING_COLOR, 'You must have DEPLOYING_COLOR set in your environment');
check(EFCMS_DOMAIN, 'You must have EFCMS_DOMAIN set in your environment');
check(ENV, 'You must have ENV set in your environment');
check(AWS_ACCOUNT_ID, 'You must have AWS_ACCOUNT_ID set in your environment');

const SNS = new AWS.SNS({ region: 'us-east-1' });

const run = async () => {
  const TopicArn = `arn:aws:sns:us-east-1:${AWS_ACCOUNT_ID}:bounced_service_emails_${ENV}`;
  const Protocol = 'lambda';
  const DeployingLambda = `arn:aws:lambda:us-east-1:${AWS_ACCOUNT_ID}:function:bounce_handler_${ENV}_${DEPLOYING_COLOR}`;
  const CurrentLambda = `arn:aws:lambda:us-east-1:${AWS_ACCOUNT_ID}:function:bounce_handler_${ENV}_${CURRENT_COLOR}`;

  await SNS.subscribe({
    Endpoint: DeployingLambda,
    Protocol,
    TopicArn,
  }).promise();

  const { SubscriptionArn } = await SNS.confirmSubscription({
    Endpoint: CurrentLambda,
    Protocol,
    TopicArn,
  }).promise();

  if (SubscriptionArn) {
    await SNS.unsubscribe({
      Endpoint: CurrentLambda,
      Protocol,
      TopicArn,
    }).promise();
  }
};

run();

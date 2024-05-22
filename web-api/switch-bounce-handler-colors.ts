import {
  ListSubscriptionsCommand,
  SNSClient,
  SubscribeCommand,
  UnsubscribeCommand,
} from '@aws-sdk/client-sns';
import { requireEnvVars } from '../shared/admin-tools/util';

requireEnvVars(['AWS_ACCOUNT_ID', 'CURRENT_COLOR', 'DEPLOYING_COLOR', 'ENV']);

const { AWS_ACCOUNT_ID, CURRENT_COLOR, DEPLOYING_COLOR, ENV } = process.env;
const SNS = new SNSClient({ region: 'us-east-1' });
const TopicArn = `arn:aws:sns:us-east-1:${AWS_ACCOUNT_ID}:bounced_service_emails_${ENV}`;

const getCurrentColorSubscription = async ({
  Token,
}: {
  Token?: string;
}): Promise<string | undefined> => {
  const CurrentLambda = `arn:aws:lambda:us-east-1:${AWS_ACCOUNT_ID}:function:bounce_handler_${ENV}_${CURRENT_COLOR}`;
  const { NextToken, Subscriptions } = await SNS.send(
    new ListSubscriptionsCommand({
      NextToken: Token,
    }),
  );

  // Look for a subscription that match the current color and return it
  const foundSubscription = Subscriptions?.find(
    ({ Endpoint, Protocol, TopicArn: SubscriptionTopicArn }) =>
      Endpoint === CurrentLambda &&
      Protocol === 'lambda' &&
      SubscriptionTopicArn === TopicArn,
  );

  if (foundSubscription) return foundSubscription.SubscriptionArn;

  if (NextToken) return getCurrentColorSubscription({ Token: NextToken });

  return undefined;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  // subscribe deploying lambda to topic
  await SNS.send(
    new SubscribeCommand({
      Endpoint: `arn:aws:lambda:us-east-1:${AWS_ACCOUNT_ID}:function:bounce_handler_${ENV}_${DEPLOYING_COLOR}`,
      Protocol: 'lambda',
      TopicArn,
    }),
  );

  // find current lambda subscription and unsubscribe from topic
  const SubscriptionArn = await getCurrentColorSubscription({});
  if (SubscriptionArn) {
    await SNS.send(new UnsubscribeCommand({ SubscriptionArn }));
  }
})();

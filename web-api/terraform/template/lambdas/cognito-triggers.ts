import { createApplicationContext } from '../../../src/applicationContext';

export const handler = async event => {
  const applicationContext = createApplicationContext({});

  if (event.triggerSource === 'PostAuthentication_Authentication') {
    // const { email, sub } = event.request.userAttributes;
    // const userId = event.request.userAttributes['custom:userId'] || sub;
    // const userFromPersistence = await applicationContext
    //   .getPersistenceGateway()
    //   .getUserById({ applicationContext, userId });
    // if (
    //   userFromPersistence &&
    //   userFromPersistence.pendingEmail &&
    //   userFromPersistence.pendingEmail === email
    // ) {
    //   const updatedUser = await applicationContext
    //     .getUseCases()
    //     .setUserEmailFromPendingEmailInteractor(applicationContext, {
    //       user: userFromPersistence,
    //     });
    applicationContext.logger.info('Nothing happened', {
      event,
      // updatedUser,
    });
    // }
  }

  return event;
};

export const updatePetitionerCasesLambda = async event => {
  const applicationContext = createApplicationContext({});

  const { Records } = event;
  const { body, receiptHandle } = Records[0];
  const user = JSON.parse(body);
  const address = `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/update_petitioner_cases_queue_${process.env.STAGE}_${process.env.CURRENT_COLOR}`;
  applicationContext.logger.info('updatePetitionerCasesLambda', event);

  await applicationContext.getUseCases().updatePetitionerCasesInteractor({
    applicationContext,
    user,
  });

  await applicationContext
    .getMessagingClient()
    .deleteMessage({
      QueueUrl: address,
      ReceiptHandle: receiptHandle,
    })
    .promise();
};

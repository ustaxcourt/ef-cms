const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  handleBounceNotificationInteractor,
} = require('./handleBounceNotificationInteractor');

describe('handleBounceNotificationInteractor', () => {
  beforeEach(() => {
    applicationContext.getIrsSuperuserEmail.mockReturnValue(
      'service.agent.test@example.com',
    );
    applicationContext.getBounceAlertRecipients.mockReturnValue([
      'sysadmin@example.com',
    ]);
  });

  it('should do nothing if the user is not the irs super user', async () => {
    await handleBounceNotificationInteractor(applicationContext, {
      bounce: {
        bounceSubType: 'OnSuppressionList',
        bounceType: 'Permanent',
        bouncedRecipients: [{ emailAddress: 'petitioner@example.com' }],
      },
    });
    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail,
    ).not.toBeCalled();

    expect(
      applicationContext.getDispatchers().sendSlackNotification,
    ).not.toBeCalled();
  });

  it('should do nothing if the bounce is not permanent', async () => {
    await handleBounceNotificationInteractor(applicationContext, {
      bounce: {
        bounceSubType: 'Example',
        bounceType: 'Temporary',
        bouncedRecipients: [{ emailAddress: 'service.agent.test@example.com' }],
      },
    });
    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail,
    ).not.toBeCalled();

    expect(
      applicationContext.getDispatchers().sendSlackNotification,
    ).not.toBeCalled();
  });

  it('sends alerts when the user is the irs super user and the bounce is Permanent', async () => {
    await handleBounceNotificationInteractor(applicationContext, {
      bounce: {
        bounceSubType: 'On Suppression List',
        bounceType: 'Permanent',
        bouncedRecipients: [{ emailAddress: 'service.agent.test@example.com' }],
      },
    });
    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail,
    ).toBeCalledWith({
      applicationContext,
      defaultTemplateData: {
        emailContent:
          'An Email to the IRS Super User (service.agent.test@example.com) has triggered a Permanent bounce (On Suppression List)',
      },
      destinations: [{ email: 'sysadmin@example.com' }],
      templateName: process.env.EMAIL_BOUNCED_SUPER_USER_TEMPLATE,
    });

    expect(
      applicationContext.getDispatchers().sendSlackNotification,
    ).toBeCalledWith({
      applicationContext,
      text: 'An Email to the IRS Super User (service.agent.test@example.com) has triggered a Permanent bounce (On Suppression List)',
      topic: 'bounce-notification',
    });
  });
});

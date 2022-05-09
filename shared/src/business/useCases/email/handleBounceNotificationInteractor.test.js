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
      bounceType: 'Permanent',
      bouncedRecipients: [{ emailAddress: 'petitioner@example.com' }],
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
      bounceType: 'Temporary',
      bouncedRecipients: [{ emailAddress: 'service.agent.test@example.com' }],
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
      bounceSubType: 'On Suppression List',
      bounceType: 'Permanent',
      bouncedRecipients: [{ emailAddress: 'service.agent.test@example.com' }],
    });
    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail,
    ).toBeCalledWith({
      applicationContext,
      defaultTemplateData: {},
      destinations: ['sysadmin@example.com'],
      templateName: process.env.EMAIL_BOUNCED_SUPER_USER_TEMPLATE,
    });

    expect(
      applicationContext.getDispatchers().sendSlackNotification,
    ).toBeCalledWith({
      applicationContext,
      message:
        'An Email to the IRS Super User has triggered a Permanent bounce (On Suppression List)',
    });
  });
});

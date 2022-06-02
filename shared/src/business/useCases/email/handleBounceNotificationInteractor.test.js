const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  handleBounceNotificationInteractor,
  parseBounceNotification,
} = require('./handleBounceNotificationInteractor');
const { BOUNCE_NOTIFICATION } = require('../../../test/mockBounceNotification');

describe('handleBounceNotificationInteractor', () => {
  beforeEach(() => {
    applicationContext.getIrsSuperuserEmail.mockReturnValue(
      'service.agent.test@example.com',
    );
    applicationContext.getBounceAlertRecipients.mockReturnValue([
      'sysadmin@example.com',
    ]);
  });

  it('should do nothing if the recipient is not the irs super user', async () => {
    await handleBounceNotificationInteractor(applicationContext, {
      ...BOUNCE_NOTIFICATION,
      bounce: {
        ...BOUNCE_NOTIFICATION.bounce,
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
      ...BOUNCE_NOTIFICATION,
      bounce: {
        ...BOUNCE_NOTIFICATION.bounce,
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
      ...BOUNCE_NOTIFICATION,
      bounce: {
        ...BOUNCE_NOTIFICATION.bounce,
        bounceSubType: 'On Suppression List',
        bounceType: 'Permanent',
        bouncedRecipients: [{ emailAddress: 'service.agent.test@example.com' }],
      },
    });
    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail,
    ).toBeCalledWith(
      expect.objectContaining({
        destinations: [{ email: 'sysadmin@example.com' }],
        templateName: process.env.EMAIL_BOUNCED_SUPER_USER_TEMPLATE,
      }),
    );

    expect(
      applicationContext.getDispatchers().sendSlackNotification,
    ).toBeCalledWith({
      applicationContext,
      text: ':warning: (local environment) An Email to the IRS Super User (service.agent.test@example.com) has triggered a Permanent bounce (On Suppression List)',
      topic: 'bounce-notification',
    });
  });
});

describe('parseBounceNotification', () => {
  it('parses an object for the information we need about a bounce', () => {
    const parsedNotification = parseBounceNotification(BOUNCE_NOTIFICATION);

    expect(parsedNotification.bounceSubType).toEqual(
      BOUNCE_NOTIFICATION.bounce.bounceSubType,
    );
    expect(parsedNotification.bounceType).toEqual(
      BOUNCE_NOTIFICATION.bounce.bounceType,
    );
    expect(parsedNotification.errorMessage).toEqual(
      BOUNCE_NOTIFICATION.bounce.bouncedRecipients[0].diagnosticCode,
    );
    expect(parsedNotification.bounceRecipient).toEqual(
      BOUNCE_NOTIFICATION.bounce.bouncedRecipients[0].emailAddress,
    );
    expect(parsedNotification.subject).toEqual(
      BOUNCE_NOTIFICATION.mail.commonHeaders.subject,
    );
  });
});

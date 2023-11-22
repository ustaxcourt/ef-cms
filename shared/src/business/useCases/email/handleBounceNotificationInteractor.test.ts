import { BOUNCE_NOTIFICATION } from '../../../test/mockBounceNotification';
import { applicationContext } from '../../test/createTestApplicationContext';
import {
  handleBounceNotificationInteractor,
  parseBounceNotification,
} from './handleBounceNotificationInteractor';

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
    ).not.toHaveBeenCalled();

    expect(
      applicationContext.getDispatchers().sendSlackNotification,
    ).not.toHaveBeenCalled();
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
    ).not.toHaveBeenCalled();

    expect(
      applicationContext.getDispatchers().sendSlackNotification,
    ).not.toHaveBeenCalled();
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
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        destinations: [{ email: 'sysadmin@example.com' }],
        templateName: process.env.BOUNCE_ALERT_TEMPLATE,
      }),
    );

    expect(
      applicationContext.getDispatchers().sendSlackNotification,
    ).toHaveBeenCalledWith({
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

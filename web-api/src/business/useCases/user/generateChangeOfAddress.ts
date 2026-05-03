import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';
import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { RawUser } from '@shared/business/entities/User';
import { getDocketNumbersByUser } from '@web-api/persistence/postgres/users/getDocketNumbersByUser';

export type TUserContact = {
  address1: string;
  address2: string;
  address3: string;
  city: string;
  country: string;
  countryType: string;
  phone: string;
  postalCode: string;
  state: string;
};

/**
 * Update an address on a case. This performs a search to get all of the cases associated with the user,
 * and then one by one determines whether or not it needs to generate a docket entry. Only open cases and
 * cases closed within the last six months should get a docket entry.
 *
 * @param {object}  providers the providers object
 * @param {object}  providers.applicationContext the application context
 * @param {boolean} providers.bypassDocketEntry whether or not we should create a docket entry for this operation
 * @param {object}  providers.contactInfo the updated contact information
 * @param {string}  providers.requestUserId the userId making the request to which to send websocket messages
 * @param {string}  providers.updatedName the name of the updated individual
 * @param {object}  providers.user the user whose address is getting updated
 * @param {string}  providers.websocketMessagePrefix is it the `user` or an `admin` performing this action?
 * @returns {Promise<Case[]>} the cases that were updated
 */
export const generateChangeOfAddress = async ({
  applicationContext,
  authorizedUser,
  bypassDocketEntry = false,
  contactInfo,
  oldUser,
  requestUserId,
  updatedEmail,
  updatedName,
  user,
  websocketMessagePrefix = 'user',
}: {
  applicationContext: ServerApplicationContext;
  bypassDocketEntry?: boolean;
  contactInfo: TUserContact;
  oldUser: RawUser;
  requestUserId?: string;
  updatedEmail?: string;
  updatedName?: string;
  user: any;
  websocketMessagePrefix?: 'user' | 'admin';
  authorizedUser: AuthUser;
}): Promise<any[] | undefined> => {
  const associatedUserCases = await getDocketNumbersByUser({
    userId: user.userId,
  });

  if (associatedUserCases.length === 0) {
    return [];
  }

  const completedCases = 0;
  const NOTIFICATION_ACTION:
    | 'user_contact_update_progress'
    | 'admin_contact_update_progress' =
    `${websocketMessagePrefix}_contact_update_progress`;

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: NOTIFICATION_ACTION,
      completedCases,
      totalCases: associatedUserCases.length,
    },
    userId: requestUserId || user.userId,
  });

  const featureFlags = await applicationContext
    .getUseCases()
    .getAllFeatureFlagsInteractor(applicationContext);

  const isChangeOfAddressLambdaEnabled =
    featureFlags[ALLOWLIST_FEATURE_FLAGS.USE_CHANGE_OF_ADDRESS_LAMBDA.key];

  const jobId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().createChangeOfAddressJob({
    docketNumbers: associatedUserCases,
    jobId,
  });

  let alwaysSendUpdateWsMessages = true;
  let indexesToSendUpdateMessage;

  if (associatedUserCases.length > 100) {
    alwaysSendUpdateWsMessages = false;
    const numCasesPerPercentagePoint = Math.floor(
      associatedUserCases.length / 100,
    );

    indexesToSendUpdateMessage = new Array<boolean>(associatedUserCases.length)
      .fill(false)
      .map((_caseBoolean, index) => index % numCasesPerPercentagePoint === 0);
  }

  applicationContext.logger.info(`creating change of address job of ${jobId}`);

  if (isChangeOfAddressLambdaEnabled) {
    const sqs: SQSClient = applicationContext.getLongTimeoutSQSMessagingClient();
    const cmds = associatedUserCases.map((docketNumber, i) => {
      return new SendMessageCommand({
        MessageBody: JSON.stringify({
          bypassDocketEntry,
          contactInfo,
          docketNumber,
          jobId,
          oldUser,
          requestUser: {
            ...authorizedUser,
            token: undefined,
          },
          requestUserId,
          updatedEmail,
          updatedName,
          user,
          websocketMessagePrefix,
          totalCases: associatedUserCases.length,
          sendUpdateProgressWsMessage: alwaysSendUpdateWsMessages
            ? true
            : indexesToSendUpdateMessage[i],
        }),
        QueueUrl: `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/change_of_address_queue_${process.env.STAGE}_${process.env.CURRENT_COLOR}`,
      });
    });
    await settlePromises(cmds.map(cmd => sqs.send(cmd)));
  } else {
    await settlePromises(
      associatedUserCases.map(async (docketNumber, i) => {
        return await applicationContext
          .getUseCaseHelpers()
          .generateChangeOfAddressHelper({
            applicationContext,
            authorizedUser,
            bypassDocketEntry,
            contactInfo,
            docketNumber,
            jobId,
            oldUser,
            requestUserId,
            updatedEmail,
            updatedName,
            user,
            websocketMessagePrefix,
            totalCases: associatedUserCases.length,
            sendUpdateProgressWsMessage: alwaysSendUpdateWsMessages
              ? true
              : indexesToSendUpdateMessage[i],
          });
      }),
    );
  }
};

import { ALLOWLIST_FEATURE_FLAGS } from '../../entities/EntityConstants';

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
const generateChangeOfAddressForPractitioner = async ({
  applicationContext,
  bypassDocketEntry = false,
  contactInfo,
  firmName,
  requestUserId,
  updatedEmail,
  updatedName,
  user,
  websocketMessagePrefix = 'user',
}: {
  applicationContext: IApplicationContext;
  bypassDocketEntry?: boolean;
  contactInfo: TUserContact;
  firmName: string;
  requestUserId?: string;
  updatedEmail?: string;
  updatedName?: string;
  user: any;
  websocketMessagePrefix?: string;
}) => {
  const associatedUserCases = await applicationContext
    .getPersistenceGateway()
    .getCasesForUser({
      applicationContext,
      userId: user.userId,
    });

  if (associatedUserCases.length === 0) {
    return [];
  }

  let completedCases = 0;
  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: `${websocketMessagePrefix}_contact_update_progress`,
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
    applicationContext,
    docketNumbers: associatedUserCases.map(caseInfo => caseInfo.docketNumber),
    jobId,
  });

  applicationContext.logger.info(`creating change of address job of ${jobId}`);

  if (isChangeOfAddressLambdaEnabled) {
    const sqs = await applicationContext.getMessagingClient();

    await Promise.all(
      associatedUserCases.map(caseInfo => {
        return sqs
          .sendMessage({
            MessageBody: JSON.stringify({
              bypassDocketEntry,
              contactInfo,
              docketNumber: caseInfo.docketNumber,
              firmName,
              jobId,
              requestUser: {
                ...applicationContext.getCurrentUser(),
                token: undefined,
              },
              requestUserId,
              updatedEmail,
              updatedName,
              user,
              websocketMessagePrefix,
            }),
            QueueUrl: `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/change_of_address_queue_${process.env.STAGE}_${process.env.CURRENT_COLOR}`,
          })
          .promise();
      }),
    );
  } else {
    await Promise.all(
      associatedUserCases.map(async caseInfo => {
        return await applicationContext
          .getUseCaseHelpers()
          .generateChangeOfAddressHelper({
            applicationContext,
            bypassDocketEntry,
            contactInfo,
            docketNumber: caseInfo.docketNumber,
            firmName,
            jobId,
            requestUserId,
            updatedEmail,
            updatedName,
            user,
            websocketMessagePrefix,
          });
      }),
    );
  }
};

export { generateChangeOfAddressForPractitioner as generateChangeOfAddress };

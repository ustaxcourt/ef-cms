import { applicationContext } from '@web-api/applicationContext';

export const changeOfAddressHandler = async event => {
  if (process.env.READ_ONLY_MODE === 'true') {
    throw new Error('Cannot execute changeOfAddressHandler during read-only mode.');
  }

  const { Records } = event;
  const { body } = Records[0];
  const eventBody = JSON.parse(body);

  applicationContext.logger.info(
    `processing job "change-of-address-job|${eventBody.jobId}", task for case ${eventBody.docketNumber}`,
  );

  await applicationContext.getUseCaseHelpers().generateChangeOfAddressHelper({
    applicationContext,
    authorizedUser: eventBody.requestUser,
    bypassDocketEntry: eventBody.bypassDocketEntry,
    contactInfo: eventBody.contactInfo,
    docketNumber: eventBody.docketNumber,
    jobId: eventBody.jobId,
    requestUserId: eventBody.requestUserId,
    updatedEmail: eventBody.updatedEmail,
    updatedName: eventBody.updatedName,
    user: eventBody.user,
    websocketMessagePrefix: eventBody.websocketMessagePrefix,
    oldUser: eventBody.oldUser,
  });
};

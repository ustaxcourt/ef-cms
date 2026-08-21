import { applicationContext } from '@web-api/applicationContext';
import { getStorageClient } from '@web-api/persistence/s3/getStorageClient';

/*
  We found that multiple lambda instances trying to open a connection to S3 causes an error, 
  and the process fails to upload the notice of change of address. Calling getStorageClient here 
  outside the handler will cache and maintain the connection between
  lambda calls while the lambda is warm.
*/
getStorageClient();

export const changeOfAddressHandler = async event => {
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
    totalCases: eventBody.totalCases,
    sendUpdateProgressWsMessage: eventBody.sendUpdateProgressWsMessage,
  });
};

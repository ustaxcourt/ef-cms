import { get } from '../../dynamodbClientService';

/**
 * getMessageById
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case containing the message
 * @param {string} providers.messageId the id of the message
 * @returns {object} the message
 */
export const getMessageById = ({
  applicationContext,
  docketNumber,
  messageId,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  messageId: string;
}) =>
  get({
    Key: {
      pk: `case|${docketNumber}`,
      sk: `message|${messageId}`,
    },
    applicationContext,
  });

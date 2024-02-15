import { getMessageThreadByParentId } from './getMessageThreadByParentId';
import { update } from '../../dynamodbClientService';

/**
 * markMessageThreadRepliedTo
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.messageId the id of the message to update
 * @returns {object} the created message
 */
export const markMessageThreadRepliedTo = async ({
  applicationContext,
  parentMessageId,
}: {
  applicationContext: IApplicationContext;
  parentMessageId: string;
}) => {
  const messages = await getMessageThreadByParentId({
    applicationContext,
    parentMessageId,
  });

  if (messages.length) {
    const updateMessage = async message => {
      return await update({
        ExpressionAttributeNames: {
          '#gsi2pk': 'gsi2pk',
          '#gsi4pk': 'gsi4pk', // TODO FIX
          '#isRepliedTo': 'isRepliedTo',
        },
        ExpressionAttributeValues: {
          ':isRepliedTo': true,
        },
        Key: {
          pk: `case|${message.docketNumber}`,
          sk: `message|${message.messageId}`,
        },
        UpdateExpression:
          'SET #isRepliedTo = :isRepliedTo, REMOVE #gsi2pk, #gsi4pk',
        applicationContext,
      });
    };

    await Promise.all(messages.map(updateMessage));
  }
};

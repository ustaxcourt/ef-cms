import { Message, RawMessage } from '@shared/business/entities/Message';
import { toKyselyNewMessage } from './mapper';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { isEmpty } from 'lodash';

export const createMessage = async ({
  message,
}: {
  message: RawMessage;
}): Promise<RawMessage> => {
  const createdMessage = await pgInsertInto({
    table: 'dwMessage',
    values: [toKyselyNewMessage(message)],
  });

  if (isEmpty(createdMessage)) {
    throw new Error('could not create a message');
  }

  return new Message(createdMessage);
};

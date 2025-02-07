import { Message, RawMessage } from '@shared/business/entities/Message';
import { toKyselyUpdateMessage } from './mapper';
import { transformNullToUndefined } from '../utils/transformNullToUndefined';
import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';
import { isEmpty } from 'lodash';

export const updateMessage = async ({
  message,
}: {
  message: RawMessage;
}): Promise<Message> => {
  const updatedMessage = await pgUpdateTable({
    table: 'dwMessage',
    values: toKyselyUpdateMessage(message),
    where: cb => cb.where('messageId', '=', message.messageId),
  });

  if (isEmpty(updatedMessage)) {
    throw new Error('could not update the message');
  }

  return new Message(transformNullToUndefined(message));
};

import { RawMessage } from '@shared/business/entities/Message';
import { toKyselyNewMessages } from './mapper';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const upsertMessages = async (messages: RawMessage[]) => {
  await pgInsertInto({
    table: 'dwMessage',
    values: toKyselyNewMessages(messages),
    onConflictColumns: ['messageId'],
  });
};

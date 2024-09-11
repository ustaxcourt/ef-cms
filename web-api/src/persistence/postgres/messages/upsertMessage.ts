import { RawMessage } from '@shared/business/entities/Message';
import { getDbWriter } from '@web-api/database';
import {
  toKyselyNewMessage,
  toKyselyNewMessages,
  toKyselyUpdateMessage,
  toKyselyUpdateMessages,
} from './mapper';

export const upsertMessage = async (message: RawMessage) => {
  await getDbWriter(writer =>
    writer
      .insertInto('message')
      .values(toKyselyNewMessage(message))
      .onConflict(oc =>
        oc.column('messageId').doUpdateSet(toKyselyUpdateMessage(message)),
      )
      .execute(),
  );
};

export const upsertMessages = async (messages: RawMessage[]) => {
  await getDbWriter(writer =>
    writer
      .insertInto('message')
      .values(toKyselyNewMessages(messages))
      .onConflict(oc =>
        oc.column('messageId').doUpdateSet(toKyselyUpdateMessages(messages)),
      )
      .execute(),
  );
};

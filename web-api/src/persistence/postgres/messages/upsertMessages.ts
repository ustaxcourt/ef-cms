import { RawMessage } from '@shared/business/entities/Message';
import { getDbWriter } from '@web-api/database';
import { toKyselyNewMessages } from './mapper';

export const upsertMessages = async (messages: RawMessage[]) => {
  if (messages.length === 0) return;

  await getDbWriter(writer =>
    writer
      .insertInto('message')
      .values(toKyselyNewMessages(messages))
      .onConflict(oc =>
        oc.column('messageId').doUpdateSet(c => {
          return {
            attachments: c.ref('excluded.attachments'),
            caseStatus: c.ref('excluded.caseStatus'),
            caseTitle: c.ref('excluded.caseTitle'),
            completedAt: c.ref('excluded.completedAt'),
            completedBy: c.ref('excluded.completedBy'),
            completedBySection: c.ref('excluded.completedBySection'),
            completedByUserId: c.ref('excluded.completedByUserId'),
            completedMessage: c.ref('excluded.completedMessage'),
            createdAt: c.ref('excluded.createdAt'),
            docketNumber: c.ref('excluded.docketNumber'),
            from: c.ref('excluded.from'),
            fromSection: c.ref('excluded.fromSection'),
            fromUserId: c.ref('excluded.fromUserId'),
            isCompleted: c.ref('excluded.isCompleted'),
            isRead: c.ref('excluded.isRead'),
            isRepliedTo: c.ref('excluded.isRepliedTo'),
            message: c.ref('excluded.message'),
            parentMessageId: c.ref('excluded.parentMessageId'),
            subject: c.ref('excluded.subject'),
            to: c.ref('excluded.to'),
            toSection: c.ref('excluded.toSection'),
            toUserId: c.ref('excluded.toUserId'),
          };
        }),
      )
      .execute(),
  );
};

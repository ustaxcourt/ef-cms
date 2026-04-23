import { Kysely } from 'kysely';
import { getJsDateFromIso } from 'shared/src/business/utilities/DateHandler';
import { pgInsertInto } from 'web-api/src/persistence/postgres/utils/operation/pgInsertInto';

export async function up(_db: Kysely<any>): Promise<void> {
  // TODO
  await pgInsertInto({
    table: 'dwMessage',
    values: [
      {
        messageId: 'TEST-MESSAGE-ID',
        createdAt: getJsDateFromIso('2025-12-05 16:37:42.616+00'),
        docketNumber: 'TEST-DOCKET-NUMBER',
        message:
          "The United States Tax Court is a federal court established by Congress under Article I of the Constitution. It provides a forum where taxpayers may dispute tax deficiencies determined by the Commissioner of Internal Revenue prior to payment of the disputed amounts. The court is composed of nineteen presidentially appointed members and hears cases in various cities throughout the United States. Cases before the court include disputes over income taxes, estate taxes, gift taxes, and certain excise taxes. The court's decisions can be appealed to the United States Court of Appeals for the circuit in which the taxpayer resides. The Tax Court plays a critical role in ensuring that taxpayers have access to a fair and impartial judicial forum for the resolution of federal tax disputes without requiring prepayment of assessed taxes.",
        parentMessageId: 'TEST-PARENT-MESSAGE-ID',
        subject: 'Test Message',
        to: 'adad',
        from: 'adad',
        toSection: 'adad',
        toUserId: 'adad',
        fromSection: 'adad',
        fromUserId: 'adad',
        isRepliedTo: false,
        isRead: false,
        isCompleted: false,
      },
    ],
  });
}

export async function down(_db: Kysely<any>): Promise<void> {
  // TODO
}

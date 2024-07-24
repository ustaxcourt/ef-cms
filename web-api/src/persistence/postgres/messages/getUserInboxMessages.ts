import { MessageResult } from '@shared/business/entities/MessageResult';

import { Case } from '@web-api/persistence/repository/Case';
import { getDataSource } from '@web-api/data-source';
import { Message as messageRepo } from '@web-api/persistence/repository/Message';
import { transformNullToUndefined } from 'postgres/helpers/transformNullToUndefined';

export const getUserInboxMessages = async ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}) => {
  applicationContext.logger.info('getUserInboxMessages start');

  const dataSource = await getDataSource();
  const messageRepository = dataSource.getRepository(messageRepo);

  // const messages = await messageRepository.find({
  //   take: 5000,
  //   where: {
  //     isCompleted: false,
  //     isRepliedTo: false,
  //     toUserId: userId,
  //   },
  // });

  // const messages: any = await messageRepository
  //   .createQueryBuilder('message')
  //   .leftJoin('case', 'case', 'case.docketNumber = message.docketNumber')
  //   .addSelect(['case.trialLocation', 'case.trialDate'])
  //   .where('message.toUserId = :userId', { userId })
  //   .andWhere('message.isCompleted = :isCompleted', { isCompleted: false })
  //   .andWhere('message.isRepliedTo = :isRepliedTo', { isRepliedTo: false })
  //   .take(5000)
  //   .getMany();

  const messages = await messageRepository
    .createQueryBuilder('message')
    .leftJoinAndSelect(Case, 'c', 'c.docketNumber = message.docketNumber')
    .addSelect(['c.trialLocation', 'c.trialDate'])
    // .where('message.toUserId = :toUserId', {
    //   toUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    // })
    // .andWhere('message.isCompleted IS FALSE')
    // .andWhere('message.isRepliedTo IS FALSE')
    .getMany();

  // const messages = await dataSource.query(`SELECT
  //       *
  //     FROM
  //       "message"
  //       LEFT JOIN "case" ON "case"."docketNumber" = "message"."docketNumber"
  //     WHERE
  //       "message"."toUserId" = '1805d1ab-18d0-43ec-bafb-654e83405416'
  //       AND "message"."isCompleted" IS FALSE
  //       AND "message"."isRepliedTo" IS FALSE`);

  applicationContext.logger.info('getUserInboxMessages end');

  console.log('*** messages', messages);

  return messages.map(message =>
    new MessageResult(
      transformNullToUndefined({
        ...message,

        // trialDate: message.case?.trialDate,
        // trialLocation: message.case?.trialLocation,
      }),
      {
        applicationContext,
      },
    ).validate(),
  );
};

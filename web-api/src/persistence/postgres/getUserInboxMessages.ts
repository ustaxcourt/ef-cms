import { MessageResult } from '@shared/business/entities/MessageResult';
import { db } from '@web-api/database';
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

  // const result = await db
  // .selectFrom('person')
  // .innerJoin('pet', 'pet.owner_id', 'person.id')
  // // `select` needs to come after the call to `innerJoin` so
  // // that you can select from the joined table.
  // .select(['person.id', 'pet.name as pet_name'])
  // .execute()

  // const dataSource = await getDataSource();
  // const messageRepository = dataSource.getRepository(messageRepo);

  // const messages = await messageRepository.find({
  //   relations: { case: true },
  //   take: 5000,
  //   where: {
  //     isCompleted: false,
  //     isRepliedTo: false,
  //     toUserId: userId,
  //   },
  // });

  const messages = await db
    .selectFrom('message')
    .leftJoin('case', 'case.docketNumber', 'message.docketNumber')
    .where('isCompleted', '=', false)
    .where('isRepliedTo', '=', false)
    .where('toUserId', '=', userId)
    .selectAll()
    .execute();

  console.log('**** messages', messages);

  applicationContext.logger.info('getUserInboxMessages end');

  return messages.map(message =>
    new MessageResult(
      // transformNullToUndefined({
      message,
      // trialDate: message.case?.trialDate,
      // trialLocation: message.case?.trialLocation,

      {
        applicationContext,
      },
    ).validate(),
  );
};

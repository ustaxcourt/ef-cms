import { getDbWriter } from '../../../../database';
import { messages } from './fixtures/messages';

export const seed = async () => {
  await getDbWriter(writer =>
    writer
      .insertInto('dwMessage')
      .values(messages)
      .onConflict(oc => oc.column('messageId').doNothing()) // ensure doesn't fail if exists
      .execute(),
  );
};

seed()
  .then(() => {
    console.log('Database data seeded successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.log('Could not seed postgres data.');
    console.log(err);
  });

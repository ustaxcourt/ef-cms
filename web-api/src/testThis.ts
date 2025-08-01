import { getDbReader } from '@web-api/database';

async function main() {
  const testInfo = await getDbReader(reader =>
    reader
      .selectFrom('dwCase as c')
      .innerJoin('dwWorkItem as w', 'c.docketNumber', 'w.docketNumber')
      .select(({ fn }) => [
        fn.jsonAgg('w').as('workItems'), // This IS lying about types
      ])
      .where('c.docketNumber', 'in', ['102-67'])
      .groupBy('c.docketNumber')
      .execute(),
  );

  console.log('testInfo', testInfo);
  console.log(testInfo[0].workItems);
  console.log(testInfo[0].workItems?.[0].createdAt);
  console.log(typeof testInfo[0].workItems?.[0].createdAt);
}

void main();

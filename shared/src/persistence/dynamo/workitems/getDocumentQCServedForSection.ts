import { GET_PARENT_CASE } from '../../elasticsearch/helpers/searchClauses';
import { search } from '../../elasticsearch/searchClient';

export const getDocumentQCServedForSection = async ({
  afterDate,
  applicationContext,
  section,
}) => {
  const query = {
    body: {
      query: {
        bool: {
          must: [
            // {
            //   prefix: { 'pk.S': 'case|' },
            // },
            // {
            //   prefix: { 'sk.S': 'work-item|' },
            // },
            {
              term: {
                'section.S': section,
              },
            },
            // {
            //   range: {
            //     'completedAt.S': {
            //       gte: 'now-7d/d',
            //     },
            //   },
            // },
          ],
          should: [GET_PARENT_CASE],
        },
      },
      size: 5000,
    },
    index: 'efcms-work-item',
  };

  const { results } = await search({
    applicationContext,
    searchParameters: query,
  });

  console.log(results);

  return results;
};

// import { queryFull } from '../../dynamodbClientService';

// export const getDocumentQCServedForSection = ({
//   afterDate,
//   applicationContext,
//   section,
// }: {
//   afterDate: string;
//   applicationContext: IApplicationContext;
//   section: string;
// }) => {
//   return queryFull({
//     ExpressionAttributeNames: {
//       '#pk': 'pk',
//       '#sk': 'sk',
//     },
//     ExpressionAttributeValues: {
//       ':afterDate': afterDate,
//       ':pk': `section-outbox|${section}`,
//     },
//     KeyConditionExpression: '#pk = :pk AND #sk >= :afterDate',
//     applicationContext,
//   }) as Promise<OutboxDynamoRecord[]>;
// };

import { ServerApplicationContext } from '@web-api/applicationContext';
import { count } from './searchClient';

export const getCountOfConsolidatedCases = async ({
  applicationContext,
  leadDocketNumber,
}: {
  applicationContext: ServerApplicationContext;
  leadDocketNumber: string;
}): Promise<number> => {
  const results = await count({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          term: {
            'leadDocketNumber.S': leadDocketNumber,
          },
        },
      },
      index: 'efcms-case',
    },
  });

  return results;
};

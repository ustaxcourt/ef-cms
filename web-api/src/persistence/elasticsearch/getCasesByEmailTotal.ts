import { ServerApplicationContext } from '@web-api/applicationContext';
import { search } from './searchClient';

type GetCasesByEmailParams = {
  applicationContext: ServerApplicationContext;
  email: string;
};
export const getCasesByEmailTotal = async ({
  applicationContext,
  email,
}: GetCasesByEmailParams) => {
  console.log('es method: getCasesByEmailTotal', email);
  const searchParameters = {
    body: {
      query: {
        bool: {
          must: [
            {
              term: {
                'entityName.S': 'Case',
              },
            },
            {
              term: {
                'petitioners.L.M.email.S': email,
              },
            },
          ],
        },
      },
    },
    index: 'efcms-case',
  };

  const { total } = await search({
    applicationContext,
    searchParameters,
  });

  return total;
};

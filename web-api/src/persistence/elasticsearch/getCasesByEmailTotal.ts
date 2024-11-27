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
  const searchParameters = {
    body: {
      index: 'efcms-case',
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
  };

  const { total } = await search({
    applicationContext,
    searchParameters,
  });

  return total;
};

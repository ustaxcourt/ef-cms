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
      query: {
        bool: {
          minimum_should_match: 1,
          must: [
            {
              term: {
                'entityName.S': 'Case',
              },
            },
          ],
          should: [
            {
              term: {
                'privatePractitioners.L.M.email.S': email,
              },
            },
            {
              term: {
                'irsPractitioners.L.M.email.S': email,
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

  const result = await search({
    applicationContext,
    searchParameters,
  });

  return result.total;
};

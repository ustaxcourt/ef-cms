import { RawUser } from '@shared/business/entities/User';
import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';

export const getAllUsersByRole = async (
  applicationContext: IApplicationContext,
  roles: string[],
): Promise<RawUser[]> => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must: [
              {
                terms: {
                  'role.S': roles,
                },
              },
            ],
          },
        },
      },
      index: 'efcms-user',
    },
  });
  return results;
};

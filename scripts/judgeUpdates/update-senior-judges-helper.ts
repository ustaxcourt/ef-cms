import { MAX_SEARCH_CLIENT_RESULTS } from '../../shared/src/business/entities/EntityConstants';
import { User } from '@shared/business/entities/User';
import { search } from '@web-api/persistence/elasticsearch/searchClient';

async function searchForAllJudges(applicationContext) {
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        from: 0,
        query: {
          bool: {
            must: {
              term: {
                'role.S': {
                  value: 'judge',
                },
              },
            },
          },
        },
        size: MAX_SEARCH_CLIENT_RESULTS,
      },
      index: 'efcms-user',
    },
  });
  return results;
}

export async function updateSeniorJudgesHelper(applicationContext) {
  const judgeUsers = await searchForAllJudges(applicationContext);
  const seniorJudgeNames = [
    'Cohen',
    'Colvin',
    'Gale',
    'Goeke',
    'Gustafson',
    'Halpern',
    'Holmes',
    'Lauber',
    'Marvel',
    'Morrison',
    'Paris',
    'Thornton',
    'Vasquez',
  ];
  const seniorJudges = judgeUsers.filter(judge => {
    return seniorJudgeNames.includes(judge.name);
  });

  for (let judge of seniorJudges) {
    const { userId } = judge;

    const userToUpdate = await applicationContext
      .getPersistenceGateway()
      .getUserById({ applicationContext, userId });
    const userEntity = new User(userToUpdate);
    userEntity.judgeTitle = 'Senior Judge';

    await applicationContext.getPersistenceGateway().updateUser({
      applicationContext,
      user: userEntity.validate().toRawObject(),
    });
  }
}

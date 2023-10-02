import { judgeUser } from '../../shared/src/test/mockUsers';
import { updateSeniorJudgesHelper } from './update-senior-judges-helper';

jest.mock('../../web-api/src/persistence/elasticsearch/searchClient', () => {
  return {
    search() {
      return {
        results: [
          {
            judgeTitle: 'Judge',
            name: 'Cohen',
          },
          {
            judgeTitle: 'Judge',
            name: 'Non Senior',
          },
        ],
      };
    },
  };
});

describe('updateSeniorJudgesHelper', () => {
  it('checks to see if the index exists', async () => {
    const updateUserMock = jest.fn();
    const applicationContext = {
      getPersistenceGateway() {
        return {
          getUserById() {
            return judgeUser;
          },
          updateUser: updateUserMock,
        };
      },
    };
    expect(judgeUser.judgeTitle).toEqual('Judge');
    await updateSeniorJudgesHelper(applicationContext);
    expect(updateUserMock.mock.calls[0][0].user.judgeTitle).toEqual(
      'Senior Judge',
    );
  });
});

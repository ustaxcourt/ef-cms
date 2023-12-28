import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getAllUsersByRole } from '@web-api/persistence/elasticsearch/users/getAllUsersByRole';
jest.mock('../searchClient');
import { searchAll } from '../searchClient';

describe('getAllUsersByRole', () => {
  it('should construct the correct elastic searach query', async () => {
    const expectedResults = ['1', '2', '3'];
    (searchAll as jest.Mock).mockReturnValue({ results: expectedResults });
    const TEST_ROLES = ['ROLE_1', 'ROLE_2'];
    const results = await getAllUsersByRole(applicationContext, TEST_ROLES);
    expect(results).toEqual(expectedResults);

    const { calls } = (searchAll as jest.Mock).mock;
    expect(calls.length).toEqual(1);

    const [roleMust] = calls[0][0].searchParameters.body.query.bool.must;
    expect(roleMust).toEqual({
      terms: {
        'role.S': TEST_ROLES,
      },
    });
  });
});

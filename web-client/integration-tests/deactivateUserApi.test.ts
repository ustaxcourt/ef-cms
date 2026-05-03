import { getDbReader } from '@web-api/persistence/postgres/database';
import {
  ACCOUNT_STATUS,
  ROLES,
} from '../../shared/src/business/entities/EntityConstants';
import { userMap } from '../../shared/src/test/mockUserTokenMap';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';

describe('verifies that the deactivate user endpoint works', () => {
  let userToken;
  const userToBeDisabled = 'disablemedocketclerk@example.com';

  beforeAll(async () => {
    await pgUpdateTable({
      table: 'dwUser',
      values: { accountStatus: ACCOUNT_STATUS.active },
      where: qb => qb.where('email', '=', userToBeDisabled),
    });
  });

  it('gets a v2 case', async () => {
    const user = {
      ...userMap['petitionsclerk@example.com'],
      'custom:userId': userMap['petitionsclerk@example.com'].userId,
      'custom:role': ROLES.zendesk,
    };

    userToken = jwt.sign(user, 'secret');

    const response = await axios.post(
      `http://localhost:4000/users/deactivate`,
      {
        email: userToBeDisabled,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );

    expect(response.status).toEqual(200);
    const dbUser = await getDbReader(cb => {
      return cb
        .selectFrom('dwUser')
        .where('email', '=', userToBeDisabled)
        .selectAll()
        .executeTakeFirst();
    });
    expect(dbUser?.accountStatus).toEqual(ACCOUNT_STATUS.inactive);
  });
});

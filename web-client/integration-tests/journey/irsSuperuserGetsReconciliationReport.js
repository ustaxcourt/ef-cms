import { userMap } from '../../../shared/src/test/mockUserTokenMap';
import axios from 'axios';
import jwt from 'jsonwebtoken';

export const irsSuperuserGetsReconciliationReport = async (
  loginUsername = 'irsSuperuser@example.com',
) => {
  if (!userMap[loginUsername]) {
    throw new Error(`Unable to log into test as ${loginUsername}`);
  }
  const user = {
    ...userMap[loginUsername],
    sub: userMap[loginUsername].userId,
  };

  const userToken = jwt.sign(user, 'secret');

  const response = await axios.get(
    'http://localhost:4000/v2/reconciliation-report/today',
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );

  return it('should', () => {});
};

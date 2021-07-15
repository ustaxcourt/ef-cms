import { userMap } from '../../../shared/src/test/mockUserTokenMap';
import axios from 'axios';
import jwt from 'jsonwebtoken';

export const irsSuperuserGetsReconciliationReport = cerebralTest => {
  return it('logs in as IRS superuser and retrieves reconciliation report data for today', async () => {
    const loginUsername = 'irsSuperuser@example.com';
    if (!userMap[loginUsername]) {
      throw new Error(`Unable to log into test as ${loginUsername}`);
    }
    const user = {
      ...userMap[loginUsername],
      sub: userMap[loginUsername].userId,
    };

    const userToken = jwt.sign(user, 'secret');

    const { data: response } = await axios.get(
      'http://localhost:4000/v2/reconciliation-report/today',
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );

    expect(response).toMatchObject({
      docketEntries: expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: cerebralTest.updatedDocketEntryId,
        }),
      ]),
      reconciliationDate: expect.anything(),
      reportTitle: 'Reconciliation Report',
      totalDocketEntries: expect.any(Number),
    });
  });
};

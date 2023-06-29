import { userMap } from '../../../shared/src/test/mockUserTokenMap';
import axios from 'axios';
import jwt from 'jsonwebtoken';

export const irsSuperuserGetsReconciliationReport = cerebralTest => {
  return it('logs in as IRS superuser and retrieves reconciliation report data for today', async () => {
    const loginUsername = 'irssuperuser@example.com';
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
          caseCaption: expect.any(String),
          docketEntryId: cerebralTest.updatedDocketEntryId,
          docketNumber: cerebralTest.docketNumber,
          documentTitle: expect.any(String),
          eventCode: expect.any(String),
          filedBy: expect.any(String),
          filingDate: expect.any(String),
          index: expect.any(Number),
          isFileAttached: expect.any(Boolean),
          servedAt: expect.any(String),
        }),
      ]),
      reconciliationDate: expect.anything(),
      reportTitle: 'Reconciliation Report',
      totalDocketEntries: expect.any(Number),
    });
  });
};

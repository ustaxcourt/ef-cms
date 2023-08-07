import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createCaseDeadline } from './createCaseDeadline';

describe('createCaseDeadline', () => {
  const CASE_DEADLINE_ID = '6805d1ab-18d0-43ec-bafb-654e83405416';

  const mockCaseDeadline = {
    caseDeadlineId: CASE_DEADLINE_ID,
    deadlineDate: '2019-03-01T21:42:29.073Z',
    description: 'hello world',
    docketNumber: '123-20',
  } as any;

  it('attempts to persist the case deadline', async () => {
    await createCaseDeadline({
      applicationContext,
      caseDeadline: mockCaseDeadline,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        caseDeadlineId: CASE_DEADLINE_ID,
        pk: `case-deadline|${CASE_DEADLINE_ID}`,
        sk: `case-deadline|${CASE_DEADLINE_ID}`,
      },
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[1][0],
    ).toMatchObject({
      Item: {
        pk: 'case|123-20',
        sk: `case-deadline|${CASE_DEADLINE_ID}`,
      },
    });
  });
});

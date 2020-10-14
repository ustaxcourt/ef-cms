const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { createCaseDeadline } = require('./createCaseDeadline');

describe('createCaseDeadline', () => {
  const CASE_DEADLINE_ID = '6805d1ab-18d0-43ec-bafb-654e83405416';

  const mockCaseDeadline = {
    caseDeadlineId: CASE_DEADLINE_ID,
    deadlineDate: '2019-03-01T21:42:29.073Z',
    description: 'hello world',
    docketNumber: '123-20',
  };

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
    expect(
      applicationContext.getDocumentClient().put.mock.calls[2][0],
    ).toMatchObject({
      Item: {
        gsi1pk: 'case-deadline-catalog',
        pk: '2019-03-01T21:42:29.073Z',
        sk: `case-deadline-catalog|${CASE_DEADLINE_ID}`,
      },
    });
  });
});

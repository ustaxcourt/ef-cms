const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { updateCaseDeadline } = require('./updateCaseDeadline');

describe('updateCaseDeadline', () => {
  const CASE_DEADLINE_ID = '6805d1ab-18d0-43ec-bafb-654e83405416';
  const DEADLINE_DATE = '2019-03-01T21:42:29.073Z';

  const mockCaseDeadline = {
    caseDeadlineId: CASE_DEADLINE_ID,
    deadlineDate: DEADLINE_DATE,
    description: 'hello world',
    docketNumber: '101-20',
  };

  it('attempts to persist the trial session', async () => {
    await updateCaseDeadline({
      applicationContext,
      caseDeadlineToUpdate: mockCaseDeadline,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: `case-deadline|${CASE_DEADLINE_ID}`,
        sk: `case-deadline|${CASE_DEADLINE_ID}`,
      },
    });
    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        gsi1pk: `case-deadline-catalog|${CASE_DEADLINE_ID}`,
        pk: 'case-deadline-catalog',
      },
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[1][0],
    ).toMatchObject({
      Item: {
        gsi1pk: `case-deadline-catalog|${CASE_DEADLINE_ID}`,
        pk: 'case-deadline-catalog',
        sk: DEADLINE_DATE,
      },
    });
  });
});

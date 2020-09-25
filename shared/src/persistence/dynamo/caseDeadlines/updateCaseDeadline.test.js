const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { updateCaseDeadline } = require('./updateCaseDeadline');

const mockCaseDeadline = {
  caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  deadlineDate: '2019-03-01T21:42:29.073Z',
  description: 'hello world',
  docketNumber: '101-20',
};

describe('updateCaseDeadline', () => {
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
  });

  it('attempts to persist the trial session', async () => {
    await updateCaseDeadline({
      applicationContext,
      caseDeadlineToUpdate: mockCaseDeadline,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: 'case-deadline|6805d1ab-18d0-43ec-bafb-654e83405416',
        sk: 'case-deadline|6805d1ab-18d0-43ec-bafb-654e83405416',
      },
      TableName: 'efcms-dev',
    });
  });
});

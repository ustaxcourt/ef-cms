const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { createCaseDeadline } = require('./createCaseDeadline');

const mockCaseDeadline = {
  caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  deadlineDate: '2019-03-01T21:42:29.073Z',
  description: 'hello world',
};

describe('createCaseDeadline', () => {
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
  });

  it('attempts to persist the trial session', async () => {
    await createCaseDeadline({
      applicationContext,
      caseDeadline: mockCaseDeadline,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        pk: 'case-deadline|6805d1ab-18d0-43ec-bafb-654e83405416',
        sk: 'case-deadline|6805d1ab-18d0-43ec-bafb-654e83405416',
      },
      TableName: 'efcms-dev',
    });
  });
});

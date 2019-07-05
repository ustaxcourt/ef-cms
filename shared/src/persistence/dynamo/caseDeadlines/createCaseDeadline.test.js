const sinon = require('sinon');
const { createCaseDeadline } = require('./createCaseDeadline');

describe('createCaseDeadline', () => {
  let applicationContext;
  let putStub;

  const mockCaseDeadline = {
    caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    deadlineDate: '2019-03-01T21:42:29.073Z',
    description: 'hello world',
  };

  beforeEach(() => {
    putStub = sinon.stub().returns({
      promise: async () => null,
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        put: putStub,
      }),
    };
  });

  it('attempts to persist the trial session', async () => {
    await createCaseDeadline({
      applicationContext,
      caseDeadline: mockCaseDeadline,
    });
    expect(putStub.getCall(0).args[0]).toMatchObject({
      Item: {
        caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        pk: 'case-deadline-6805d1ab-18d0-43ec-bafb-654e83405416',
        sk: 'case-deadline-6805d1ab-18d0-43ec-bafb-654e83405416',
      },
      TableName: 'efcms-dev',
    });
  });
});

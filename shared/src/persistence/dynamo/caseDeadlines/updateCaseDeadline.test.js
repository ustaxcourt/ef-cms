const { updateCaseDeadline } = require('./updateCaseDeadline');

describe('updateCaseDeadline', () => {
  let applicationContext;
  let updateStub;

  const mockCaseDeadline = {
    caseDeadlineId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    deadlineDate: '2019-03-01T21:42:29.073Z',
    description: 'hello world',
  };

  beforeEach(() => {
    updateStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        put: updateStub,
      }),
    };
  });

  it('attempts to persist the trial session', async () => {
    await updateCaseDeadline({
      applicationContext,
      caseDeadlineToUpdate: mockCaseDeadline,
    });

    expect(updateStub.mock.calls[0][0]).toMatchObject({
      Item: {
        pk: 'case-deadline|6805d1ab-18d0-43ec-bafb-654e83405416',
        sk: 'case-deadline|6805d1ab-18d0-43ec-bafb-654e83405416',
      },
      TableName: 'efcms-dev',
    });
  });
});

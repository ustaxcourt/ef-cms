const { forAllRecords } = require('./utilities');
const { up } = require('./00018-eligible-for-trial-catalog-docket-number');

describe('add docketNumber to eligible for trial catalog records', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let getStub;
  let mockItems = [];

  const CASE_ID = 'af2ffbd8-e482-4204-9b66-478799ea77bb';
  const DOCKET_NUMBER = '101-20';

  const mockEligibleForTrialCatalogRecord = {
    caseId: CASE_ID,
    gsi1pk: `eligible-for-trial-case-catalog|${CASE_ID}`,
    pk: 'eligible-for-trial-case-catalog',
    sk: `blahblahblah-${CASE_ID}`,
  };

  beforeEach(() => {
    mockItems = [mockEligibleForTrialCatalogRecord];

    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: mockItems,
      }),
    });

    putStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    getStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          caseId: CASE_ID,
          docketNumber: DOCKET_NUMBER,
        },
      }),
    });

    documentClient = {
      get: getStub,
      put: putStub,
      scan: scanStub,
    };
  });

  it('should not modify records that are NOT eligible for trial records', async () => {
    mockItems = [
      {
        pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
        sk: 'message|5a79c990-cc6c-4b99-8fca-8e31f2d9e78a',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should not modify records if caseId cannot be obtained from the gsi1pk', async () => {
    mockItems = [
      {
        ...mockEligibleForTrialCatalogRecord,
        gsi1pk: 'eligible-for-trial-case-catalog',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should not modify records if caseRecord is empty', async () => {
    getStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });
    documentClient.get = getStub;

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should update gsi1pk and sk and add docketNumber to eligible for trial records', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item']).toMatchObject({
      docketNumber: DOCKET_NUMBER,
      gsi1pk: `eligible-for-trial-case-catalog|${DOCKET_NUMBER}`,
      sk: `blahblahblah-${DOCKET_NUMBER}`,
    });
  });
});

const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { up } = require('./00039-serve-autoserved-docketentries');

describe('serve auto-servable docket entries that were missing', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let getStub;
  let queryStub;
  let mockItems = {};

  const contactPrimary = {
    email: 'contactprimary@example.com',
    name: 'Contact Primary',
  };

  const contactSecondary = {
    address1: 'Test Address',
    city: 'Testville',
    name: 'Contact Secondary',
    state: 'CA',
  };

  const DOCUMENT_ID = 'cdf86221-71eb-44ca-a445-522c9c754838';

  const validDocketEntry = {
    createdAt: '2019-03-27T00:00:00.000-04:00',
    docketEntryId: DOCUMENT_ID,
    documentTitle: 'Notice of Election to Participate',
    documentType: 'Notice of Election to Participate',
    entityName: 'DocketEntry',
    eventCode: 'NOEP',
    filedBy: 'Test Petitioner',
    judge: 'Chief Judge',
    userId: 'e5c275c9-bd0f-4c96-ba36-5b4136317d0a',
  };

  const mockDocketEntryRecord = {
    ...validDocketEntry,
    pk: 'case|101-20',
    sk: `docket-entry|${DOCUMENT_ID}`,
  };

  const mockCaseRecord = {
    ...MOCK_CASE,
    pk: `case|${MOCK_CASE.docketNumber}`,
    sk: `case|${MOCK_CASE.docketNumber}`,
  };

  beforeEach(() => {
    mockItems = [mockDocketEntryRecord];
  });

  beforeAll(() => {
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
          contactPrimary,
          contactSecondary,
        },
      }),
    });

    queryStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [mockCaseRecord],
      }),
    });

    documentClient = {
      get: getStub,
      put: putStub,
      query: queryStub,
      scan: scanStub,
    };
  });

  it('should not modify records that are NOT docket entry records', async () => {
    mockItems = [
      {
        pk: 'user|a63bd8dd-c7ab-4628-8486-cd4f5a61eed7',
        sk: 'user|a63bd8dd-c7ab-4628-8486-cd4f5a61eed7',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should not modify records that have already been served', async () => {
    mockItems = [
      {
        ...mockDocketEntryRecord,
        servedAt: '2019-03-27T00:00:00.000-04:00',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should set docketEntry as served if it is auto-servable', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item'].docketEntryId).toEqual(DOCUMENT_ID);
  });

  it('should not set docketEntry as served if it is not auto-servable', async () => {
    mockItems = [
      {
        ...mockDocketEntryRecord,
        documentTitle: 'Transcript',
        documentType: 'Transcript',
        eventCode: 'TRAN',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });
});

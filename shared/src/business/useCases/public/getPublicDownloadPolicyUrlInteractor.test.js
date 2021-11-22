const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getPublicDownloadPolicyUrlInteractor,
} = require('./getPublicDownloadPolicyUrlInteractor');
const { cloneDeep } = require('lodash');
const { DocketEntry } = require('../../entities/DocketEntry');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getPublicDownloadPolicyUrlInteractor', () => {
  let mockCase;

  beforeEach(() => {
    mockCase = cloneDeep(MOCK_CASE);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);
    applicationContext
      .getPersistenceGateway()
      .getPublicDownloadPolicyUrl.mockReturnValue('localhost');
  });

  it('should throw an error for a document that is not public accessible', async () => {
    await expect(
      getPublicDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: '123-20',
        isTerminalUser: false,
        key: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow('Unauthorized to access private document');
  });

  it('should return a URL for a document accessible by terminal users', async () => {
    const result = await getPublicDownloadPolicyUrlInteractor(
      applicationContext,
      {
        docketNumber: '123-20',
        isTerminalUser: true,
        key: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      },
    );

    expect(
      applicationContext.getPersistenceGateway().getPublicDownloadPolicyUrl,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().getPublicDownloadPolicyUrl.mock
        .calls[0][0],
    ).toMatchObject({
      key: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });

    expect(result).toEqual('localhost');
  });

  it('should throw an error for a case that is not found', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({ docketEntries: [] });

    await expect(
      getPublicDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: '123-20',
        key: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow('Case 123-20 was not found.');
  });

  it('should throw an error for a public document that is part of a sealed case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...mockCase,
        sealedDate: '2019-03-01T21:40:46.415Z',
      });

    mockCase.docketEntries.push(
      new DocketEntry(
        {
          docketEntryId: '5a3ea70f-c539-4118-81a3-0be94be3b4f1',
          documentTitle: 'Order to do something',
          documentType: 'Order',
          eventCode: 'O',
          isFileAttached: true,
          isOnDocketRecord: true,
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        { applicationContext },
      ),
    );
    await expect(
      getPublicDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: '123-20',
        key: '5a3ea70f-c539-4118-81a3-0be94be3b4f1',
      }),
    ).rejects.toThrow('Unauthorized to access documents in a sealed case');
  });

  it('should return a url for an opinion document that is part of a sealed case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...mockCase,
        sealedDate: '2019-03-01T21:40:46.415Z',
      });

    mockCase.docketEntries.push(
      new DocketEntry(
        {
          docketEntryId: '83813a24-7687-418e-a186-c416b4bb0ad4',
          documentTitle: 'Memorandum Opinion',
          documentType: 'Memorandum Opinion',
          eventCode: 'MOP',
          isFileAttached: true,
          isOnDocketRecord: true,
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        { applicationContext },
      ),
    );
    const result = await getPublicDownloadPolicyUrlInteractor(
      applicationContext,
      {
        docketNumber: '123-20',
        key: '83813a24-7687-418e-a186-c416b4bb0ad4',
      },
    );
    expect(result).toEqual('localhost');
  });

  it('should return a url for a document that is public accessible', async () => {
    mockCase.docketEntries.push(
      new DocketEntry(
        {
          docketEntryId: '8008b288-8b6b-48e3-8239-599266b13b8b',
          documentTitle: 'Order to do something',
          documentType: 'Order',
          eventCode: 'O',
          isFileAttached: true,
          isOnDocketRecord: true,
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        { applicationContext },
      ),
    );

    const result = await getPublicDownloadPolicyUrlInteractor(
      applicationContext,
      {
        docketNumber: '123-20',
        key: '8008b288-8b6b-48e3-8239-599266b13b8b',
      },
    );
    expect(result).toEqual('localhost');
  });

  it('should throw a not found error for a document that is not found on the case', async () => {
    await expect(
      getPublicDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: '123-20',
        key: 'b907f4e5-4d4d-44b3-bcfd-224a6f31d889',
      }),
    ).rejects.toThrow(
      'Docket entry b907f4e5-4d4d-44b3-bcfd-224a6f31d889 was not found.',
    );
  });

  it('should throw a not found error for a document that does not have a file attached', async () => {
    mockCase.docketEntries.push(
      new DocketEntry(
        {
          createdAt: '2018-01-21T20:49:28.192Z',
          docketEntryId: '8205c4bc-879f-4648-a3ba-9280384c4c00',
          docketNumber: '101-18',
          documentTitle: 'Request for Place of Trial',
          documentType: 'Request for Place of Trial',
          eventCode: 'RQT',
          isFileAttached: false,
        },
        { applicationContext },
      ),
    );

    await expect(
      getPublicDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: '123-20',
        key: '8205c4bc-879f-4648-a3ba-9280384c4c00',
      }),
    ).rejects.toThrow(
      'Docket entry 8205c4bc-879f-4648-a3ba-9280384c4c00 does not have an attached file.',
    );
  });
});

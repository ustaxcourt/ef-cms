const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getPublicDownloadPolicyUrlInteractor,
} = require('./getPublicDownloadPolicyUrlInteractor');
const { DocketEntry } = require('../../entities/DocketEntry');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_USERS } = require('../../../test/mockUsers');

describe('getPublicDownloadPolicyUrlInteractor', () => {
  beforeEach(() => {});

  it('should throw an error for a document that is not public accessible', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .getPublicDownloadPolicyUrl.mockReturnValue(
        'http://example.com/document/c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      );

    await expect(
      getPublicDownloadPolicyUrlInteractor({
        applicationContext,
        docketNumber: '123-20',
        key: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow('Unauthorized to access private document');
  });

  it('should throw an error for a public document that is part of a sealed case', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        sealedDate: '2019-03-01T21:40:46.415Z',
      });
    applicationContext
      .getPersistenceGateway()
      .getPublicDownloadPolicyUrl.mockReturnValue(
        'http://example.com/document/5a3ea70f-c539-4118-81a3-0be94be3b4f1',
      );

    MOCK_CASE.docketEntries.push(
      new DocketEntry(
        {
          docketEntryId: '5a3ea70f-c539-4118-81a3-0be94be3b4f1',
          documentTitle: 'Order to do something',
          documentType: 'Order',
          eventCode: 'O',
          isOnDocketRecord: true,
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        { applicationContext },
      ),
    );
    await expect(
      getPublicDownloadPolicyUrlInteractor({
        applicationContext,
        docketNumber: '123-20',
        key: '5a3ea70f-c539-4118-81a3-0be94be3b4f1',
      }),
    ).rejects.toThrow('Unauthorized to access documents in a sealed case');
  });

  it('should return a url for an opinion document that is part of a sealed case', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        sealedDate: '2019-03-01T21:40:46.415Z',
      });
    applicationContext
      .getPersistenceGateway()
      .getPublicDownloadPolicyUrl.mockReturnValue(
        'http://example.com/document/83813a24-7687-418e-a186-c416b4bb0ad4',
      );

    MOCK_CASE.docketEntries.push(
      new DocketEntry(
        {
          docketEntryId: '83813a24-7687-418e-a186-c416b4bb0ad4',
          documentTitle: 'Memorandum Opinion',
          documentType: 'Memorandum Opinion',
          eventCode: 'MOP',
          isOnDocketRecord: true,
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        { applicationContext },
      ),
    );
    const result = await getPublicDownloadPolicyUrlInteractor({
      applicationContext,
      docketNumber: '123-20',
      key: '83813a24-7687-418e-a186-c416b4bb0ad4',
    });
    expect(result).toEqual(
      'http://example.com/document/83813a24-7687-418e-a186-c416b4bb0ad4',
    );
  });

  it('should return a url for a document that is public accessible', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .getPublicDownloadPolicyUrl.mockReturnValue(
        'http://example.com/document/8008b288-8b6b-48e3-8239-599266b13b8b',
      );

    MOCK_CASE.docketEntries.push(
      new DocketEntry(
        {
          docketEntryId: '8008b288-8b6b-48e3-8239-599266b13b8b',
          documentTitle: 'Order to do something',
          documentType: 'Order',
          eventCode: 'O',
          isOnDocketRecord: true,
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        { applicationContext },
      ),
    );
    const result = await getPublicDownloadPolicyUrlInteractor({
      applicationContext,
      docketNumber: '123-20',
      key: '8008b288-8b6b-48e3-8239-599266b13b8b',
    });
    expect(result).toEqual(
      'http://example.com/document/8008b288-8b6b-48e3-8239-599266b13b8b',
    );
  });
});

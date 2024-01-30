import {
  DOCKET_ENTRY_SEALED_TO_TYPES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
} from '../../entities/EntityConstants';
import { DocketEntry } from '../../entities/DocketEntry';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { getPublicDownloadPolicyUrlInteractor } from './getPublicDownloadPolicyUrlInteractor';

describe('getPublicDownloadPolicyUrlInteractor', () => {
  let mockCase;

  beforeEach(() => {
    mockCase = cloneDeep(MOCK_CASE);
    mockCase.docketEntries[0].servedAt = '2019-03-01T21:40:46.415Z';

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);
    applicationContext
      .getPersistenceGateway()
      .getPublicDownloadPolicyUrl.mockReturnValue('localhost');
  });

  it('should throw an error for a document that is not publicly accessible', async () => {
    jest.spyOn(DocketEntry, 'isPublic').mockReturnValueOnce(false);

    await expect(
      getPublicDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: '123-20',
        isTerminalUser: false,
        key: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
      }),
    ).rejects.toThrow('Unauthorized to access private document');
  });

  it('should return a URL for a document accessible by terminal users', async () => {
    const result = await getPublicDownloadPolicyUrlInteractor(
      applicationContext,
      {
        docketNumber: '123-20',
        isTerminalUser: true,
        key: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
      },
    );

    expect(
      applicationContext.getPersistenceGateway().getPublicDownloadPolicyUrl,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().getPublicDownloadPolicyUrl.mock
        .calls[0][0],
    ).toMatchObject({
      key: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
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
        key: '9de27a7d-7c6b-434b-803b-7655f82d5e07',
      } as any),
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
      } as any),
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
          processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
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
      } as any,
    );
    expect(result).toEqual('localhost');
  });

  it('should return a url for a document that is publicly accessible', async () => {
    mockCase.docketEntries.push(
      new DocketEntry(
        {
          docketEntryId: '8008b288-8b6b-48e3-8239-599266b13b8b',
          documentTitle: 'Order to do something',
          documentType: 'Order',
          eventCode: 'O',
          isFileAttached: true,
          isOnDocketRecord: true,
          processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
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
      } as any,
    );
    expect(result).toEqual('localhost');
  });

  it('should throw a not found error for a document that is not found on the case', async () => {
    await expect(
      getPublicDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: '123-20',
        key: 'b907f4e5-4d4d-44b3-bcfd-224a6f31d889',
      } as any),
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
      } as any),
    ).rejects.toThrow(
      'Docket entry 8205c4bc-879f-4648-a3ba-9280384c4c00 does not have an attached file.',
    );
  });

  it('should throw an error if the user is a public user and the docket entry has been sealed', async () => {
    mockCase.docketEntries.push(
      new DocketEntry(
        {
          createdAt: '2018-01-21T20:49:28.192Z',
          docketEntryId: '8205c4bc-879f-4648-a3ba-9280384c4c00',
          docketNumber: '101-18',
          documentTitle: 'Order for something',
          documentType: 'Order',
          eventCode: 'O',
          isFileAttached: true,
          isOnDocketRecord: true,
          isSealed: true,
          sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
        },
        { applicationContext },
      ),
    );

    await expect(
      getPublicDownloadPolicyUrlInteractor(applicationContext, {
        docketNumber: '123-20',
        key: '8205c4bc-879f-4648-a3ba-9280384c4c00',
      } as any),
    ).rejects.toThrow('Docket entry has been sealed.');
  });
});

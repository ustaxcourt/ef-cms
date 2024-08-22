import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { completeDocumentSigningAction } from './completeDocumentSigningAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('completeDocumentSigningAction', () => {
  const {
    generateSignedDocumentInteractor,
    getInboxMessagesForUserInteractor,
  } = applicationContext.getUseCases();
  const { uploadDocumentFromClient } =
    applicationContext.getPersistenceGateway();

  const docketNumber = '123';

  const mockDocketEntryId = applicationContext.getUniqueId();

  applicationContext
    .getUseCases()
    .saveSignedDocumentInteractor.mockReturnValue({
      signedDocketEntryId: mockDocketEntryId,
    });

  let mockState;
  let mockPdfjsObj;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    mockState = {
      caseDetail: {
        docketEntries: [
          {
            docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
            workItem: {
              messages: [
                {
                  messageId: '123',
                },
              ],
            },
          },
        ],
        docketNumber,
      },
      currentViewMetadata: {
        messageId: '123',
      },
      pdfForSigning: {
        docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
        pageNumber: 3,
        signatureData: {
          scale: 1,
          x: 300,
          y: 400,
        },
      },
    };

    mockPdfjsObj = {
      getData: jest.fn().mockResolvedValue(true),
    };

    global.File = jest.fn();

    uploadDocumentFromClient.mockReturnValue(
      'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
    );
    getInboxMessagesForUserInteractor.mockReturnValue([
      {
        docketEntry: {
          documentType: 'Proposed Stipulated Decision',
        },
        workItemId: '1',
      },
    ]);
  });

  beforeEach(() => {
    global.window.pdfjsObj = mockPdfjsObj;
  });

  it('should sign a document via executing various use cases', async () => {
    const result = await runAction(completeDocumentSigningAction, {
      modules: {
        presenter,
      },
      state: mockState,
    });

    expect(uploadDocumentFromClient.mock.calls.length).toBe(1);
    expect(generateSignedDocumentInteractor.mock.calls.length).toBe(1);
    expect(
      applicationContext.getUseCases().saveSignedDocumentInteractor.mock.calls
        .length,
    ).toBe(1);
    expect(result.output).toMatchObject({
      docketNumber,
      redirectUrl: `/case-detail/${docketNumber}/draft-documents?docketEntryId=${mockDocketEntryId}`,
      tab: 'docketRecord',
    });
  });

  it('should NOT sign a document without signature data', async () => {
    const result = await runAction(completeDocumentSigningAction, {
      modules: {
        presenter,
      },
      state: {
        ...mockState,
        pdfForSigning: {
          docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          pageNumber: 3,
          pdfjsLib: {},
        },
      },
    });

    expect(uploadDocumentFromClient.mock.calls.length).toBe(0);
    expect(generateSignedDocumentInteractor.mock.calls.length).toBe(0);
    expect(
      applicationContext.getUseCases().saveSignedDocumentInteractor.mock.calls
        .length,
    ).toBe(0);
    expect(result.output).toMatchObject({
      docketNumber,
      tab: 'docketRecord',
    });
  });

  it('should construct a redirectUrl to the message detail document view if there is a parentMessageId present in state', async () => {
    const parentMessageId = applicationContext.getUniqueId();

    const result = await runAction(completeDocumentSigningAction, {
      modules: {
        presenter,
      },
      state: {
        ...mockState,
        parentMessageId,
      },
    });

    expect(result.output).toMatchObject({
      redirectUrl: `/messages/${docketNumber}/message-detail/${parentMessageId}?documentId=${mockDocketEntryId}`,
    });
  });

  it('should construct a redirectUrl to the draft documents view if there is no parentMessageId present in state', async () => {
    const result = await runAction(completeDocumentSigningAction, {
      modules: {
        presenter,
      },
      state: mockState,
    });

    expect(result.output).toMatchObject({
      redirectUrl: `/case-detail/${docketNumber}/draft-documents?docketEntryId=${mockDocketEntryId}`,
    });
  });

  it('returns the updated documents docketEntryId as props', async () => {
    const { output } = await runAction(completeDocumentSigningAction, {
      modules: {
        presenter,
      },
      state: mockState,
    });

    expect(output.docketEntryId).toBeDefined();
  });

  it('accesses pdfjsObj from state if not available on window', async () => {
    delete global.window.pdfjsObj;
    await runAction(completeDocumentSigningAction, {
      modules: {
        presenter,
      },
      state: {
        ...mockState,
        pdfForSigning: {
          ...mockState.pdfForSigning,
          pdfjsObj: () => mockPdfjsObj,
        },
      },
    });

    expect(mockPdfjsObj.getData).toHaveBeenCalled();
  });
});

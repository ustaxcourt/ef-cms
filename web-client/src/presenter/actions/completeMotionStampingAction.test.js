import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { completeMotionStampingAction } from './completeMotionStampingAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('completeMotionStampingAction', () => {
  const { generateStampedDocumentInteractor } =
    applicationContext.getUseCases();
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
        stampData: {
          scale: 1,
          x: 300,
          y: 400,
        },
      },
    };

    applicationContext.getCurrentUser.mockReturnValue({
      userId: '15adf875-8c3c-4e94-91e9-a4c1bff51291',
    });

    mockPdfjsObj = {
      getData: jest.fn().mockResolvedValue(true),
    };

    global.File = jest.fn();

    uploadDocumentFromClient.mockReturnValue(
      'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
    );
  });

  beforeEach(() => {
    global.window.pdfjsObj = mockPdfjsObj;
  });

  it('should stamp a document via executing various use cases', async () => {
    const result = await runAction(completeMotionStampingAction, {
      modules: {
        presenter,
      },
      state: mockState,
    });

    expect(uploadDocumentFromClient.mock.calls.length).toBe(1);
    expect(generateStampedDocumentInteractor.mock.calls.length).toBe(1);
    expect(
      applicationContext.getUseCases().saveSignedDocumentInteractor.mock.calls
        .length,
    ).toBe(1);
    expect(result.output).toMatchObject({
      docketNumber,
      tab: 'docketRecord',
    });
  });

  it('should NOT stamp a document without stamp data', async () => {
    const result = await runAction(completeMotionStampingAction, {
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
    expect(generateStampedDocumentInteractor.mock.calls.length).toBe(0);
    expect(
      applicationContext.getUseCases().saveSignedDocumentInteractor.mock.calls
        .length,
    ).toBe(0);
    expect(result.output).toMatchObject({
      docketNumber,
      tab: 'docketRecord',
    });
  });

  it('should construct a redirectUrl to the draft documents view', async () => {
    const result = await runAction(completeMotionStampingAction, {
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
    const { output } = await runAction(completeMotionStampingAction, {
      modules: {
        presenter,
      },
      state: mockState,
    });

    expect(output.docketEntryId).toBeDefined();
  });

  it('accesses pdfjsObj from state if not available on window', async () => {
    delete global.window.pdfjsObj;
    await runAction(completeMotionStampingAction, {
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

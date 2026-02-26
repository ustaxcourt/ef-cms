import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { completeDocketEntryQCAction } from './completeDocketEntryQCAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('completeDocketEntryQCAction', () => {
  const mockDocketEntryId = '123-456-789-abc';

  const caseDetail = {
    docketEntries: [
      {
        docketEntryId: mockDocketEntryId,
        documentTitle: "bob's burgers",
        addToCoversheet: false,
        additionalInfo: '',
      },
    ] as Array<{
      docketEntryId: string;
      documentTitle: string;
      addToCoversheet?: boolean;
      additionalInfo?: string;
    }>,
    docketNumber: '123-45',
  };

  let errorMock;
  let successMock;

  beforeAll(() => {
    errorMock = jest.fn();
    successMock = jest.fn();

    applicationContext
      .getUseCases()
      .completeDocketEntryQCInteractor.mockReturnValue({ caseDetail });

    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };
  });

  it('should call completeDocketEntryQCInteractor and return caseDetail', async () => {
    await runAction(completeDocketEntryQCAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail,
        docketEntryId: mockDocketEntryId,
        form: {
          primaryDocumentFile: {},
        },
      },
    });
    expect(
      applicationContext.getUseCases().completeDocketEntryQCInteractor.mock
        .calls.length,
    ).toEqual(1);

    expect(successMock.mock.calls[0][0]).toEqual({
      alertSuccess: {
        message: "bob's burgers has been completed.",
        title: 'QC Completed',
      },
      caseDetail,
      docketEntryId: mockDocketEntryId,
      docketNumber: caseDetail.docketNumber,
      paperServiceDocumentTitle: undefined,
      paperServiceParties: undefined,
      pdfUrl: undefined,
    });
  });

  it('should return the full document title with additional info as a part of props.alertSuccess.message without appending additional text when props.qcCompletionAndMessageFlag is falsy', async () => {
    caseDetail.docketEntries[0] = {
      ...caseDetail.docketEntries[0],
      addToCoversheet: true,
      additionalInfo: 'More title information',
    };

    await runAction(completeDocketEntryQCAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail,
        docketEntryId: mockDocketEntryId,
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(successMock.mock.calls[0][0].alertSuccess.message).toEqual(
      "bob's burgers More title information has been completed.",
    );
  });

  it('should return the full document title with the addition of "and message sent" as a part of props.alertSuccess.message when props.qcCompletionAndMessageFlag is true', async () => {
    caseDetail.docketEntries[0] = {
      ...caseDetail.docketEntries[0],
      addToCoversheet: true,
      additionalInfo: 'More title information',
    };

    await runAction(completeDocketEntryQCAction, {
      modules: {
        presenter,
      },
      props: {
        qcCompletionAndMessageFlag: true,
      },
      state: {
        caseDetail,
        docketEntryId: mockDocketEntryId,
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(successMock.mock.calls[0][0].alertSuccess.message).toEqual(
      "bob's burgers More title information QC completed and message sent.",
    );
  });

  it('should return error path when an error is thrown', async () => {
    const mockError = new Error('An error');
    applicationContext
      .getUseCases()
      .completeDocketEntryQCInteractor.mockRejectedValueOnce(mockError);

    await runAction(completeDocketEntryQCAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail,
        docketEntryId: mockDocketEntryId,
        form: {},
      },
    });

    expect(errorMock).toHaveBeenCalledWith({ error: mockError });
  });
});

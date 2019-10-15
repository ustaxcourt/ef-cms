import { completeDocketEntryQCAction } from './completeDocketEntryQCAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('completeDocketEntryQCAction', () => {
  let completeDocketEntryQCInteractorMock;
  let caseDetail;

  beforeEach(() => {
    caseDetail = {
      caseId: '123',
      docketNumber: '123-45',
      documents: [
        { documentId: '123-456-789-abc', documentTitle: "bob's burgers" },
      ],
    };

    completeDocketEntryQCInteractorMock = jest.fn(() => caseDetail);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        completeDocketEntryQCInteractor: completeDocketEntryQCInteractorMock,
      }),
      getUtilities: () => ({
        createISODateString: () => new Date().toISOString(),
      }),
    };
  });

  it('should call completeDocketEntryQCInteractor and return caseDetail', async () => {
    const result = await runAction(completeDocketEntryQCAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail,
        documentId: '123-456-789-abc',
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(completeDocketEntryQCInteractorMock).toHaveBeenCalled();
    expect(result.output).toEqual({
      alertSuccess: {
        message: "bob's burgers has been completed.",
        title: 'QC Completed',
      },
      caseDetail,
      caseId: caseDetail.docketNumber,
    });
  });
});

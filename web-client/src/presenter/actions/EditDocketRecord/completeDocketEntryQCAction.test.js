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
        document: '123-456-789-abc',
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(completeDocketEntryQCInteractorMock).toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      caseId: caseDetail.docketNumber,
    });
  });
});

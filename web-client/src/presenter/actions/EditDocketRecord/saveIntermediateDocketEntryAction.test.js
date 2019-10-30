import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { saveIntermediateDocketEntryAction } from './saveIntermediateDocketEntryAction';

describe('saveIntermediateDocketEntryAction', () => {
  let saveIntermediateDocketEntryInteractorMock;
  let caseDetail;

  beforeEach(() => {
    caseDetail = {
      caseId: '123',
      docketNumber: '123-45',
    };

    saveIntermediateDocketEntryInteractorMock = jest.fn(() => caseDetail);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        saveIntermediateDocketEntryInteractor: saveIntermediateDocketEntryInteractorMock,
      }),
      getUtilities: () => ({
        createISODateString: () => new Date().toISOString(),
      }),
    };
  });

  it('should call saveIntermediateDocketEntryInteractor and return caseDetail', async () => {
    const result = await runAction(saveIntermediateDocketEntryAction, {
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

    expect(saveIntermediateDocketEntryInteractorMock).toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      caseId: caseDetail.docketNumber,
    });
  });
});

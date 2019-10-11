import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { saveIntermediateDocketEntryAction } from './saveIntermediateDocketEntryAction';

describe('saveIntermediateDocketEntryAction', () => {
  let updateDocketEntryInteractorMock;
  let caseDetail;

  beforeEach(() => {
    caseDetail = {
      caseId: '123',
      docketNumber: '123-45',
    };

    updateDocketEntryInteractorMock = jest.fn(() => caseDetail);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        updateDocketEntryInteractor: updateDocketEntryInteractorMock,
      }),
      getUtilities: () => ({
        createISODateString: () => new Date().toISOString(),
      }),
    };
  });

  it('should call updateDocketEntryInteractor and return caseDetail', async () => {
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

    expect(updateDocketEntryInteractorMock).toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      caseId: caseDetail.docketNumber,
    });
  });
});

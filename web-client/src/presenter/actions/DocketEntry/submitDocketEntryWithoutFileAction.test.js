import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitDocketEntryWithoutFileAction } from './submitDocketEntryWithoutFileAction';

describe('submitDocketEntryWithoutFileAction', () => {
  let fileDocketEntryInteractorMock;
  let caseDetail;

  beforeEach(() => {
    caseDetail = {
      caseId: '123',
      docketNumber: '123-45',
    };

    fileDocketEntryInteractorMock = jest.fn(() => caseDetail);

    presenter.providers.applicationContext = {
      getUniqueId: () => new Date().getTime(),
      getUseCases: () => ({
        fileDocketEntryInteractor: fileDocketEntryInteractorMock,
      }),
      getUtilities: () => ({
        createISODateString: () => new Date().toISOString(),
      }),
    };
  });

  it('should call fileDocketEntryInteractor and return caseDetail', async () => {
    const result = await runAction(submitDocketEntryWithoutFileAction, {
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

    expect(fileDocketEntryInteractorMock).toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      caseId: caseDetail.docketNumber,
    });
  });
});

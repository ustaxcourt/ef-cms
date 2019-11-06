import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitDocketEntryWithFileAction } from './submitDocketEntryWithFileAction';

describe('submitDocketEntryWithFileAction', () => {
  let virusScanPdfInteractorMock;
  let validatePdfInteractorMock;
  let fileDocketEntryInteractorMock;
  let addCoversheetInteractorMock;
  let caseDetail;

  beforeEach(() => {
    caseDetail = {
      caseId: '123',
      docketNumber: '123-45',
    };

    validatePdfInteractorMock = jest.fn();
    virusScanPdfInteractorMock = jest.fn();
    fileDocketEntryInteractorMock = jest.fn(() => caseDetail);
    addCoversheetInteractorMock = jest.fn();

    //updateDocketEntryInteractorMock = jest.fn(() => caseDetail);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        addCoversheetInteractor: addCoversheetInteractorMock,
        fileDocketEntryInteractor: fileDocketEntryInteractorMock,
        validatePdfInteractor: validatePdfInteractorMock,
        virusScanPdfInteractor: virusScanPdfInteractorMock,
      }),
      getUtilities: () => ({
        createISODateString: () => new Date().toISOString(),
      }),
    };
  });

  it('should call submitDocketEntryWithFileAction and return caseDetail', async () => {
    const result = await runAction(submitDocketEntryWithFileAction, {
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

    expect(addCoversheetInteractorMock).toHaveBeenCalled();
    expect(fileDocketEntryInteractorMock).toHaveBeenCalled();
    expect(validatePdfInteractorMock).toHaveBeenCalled();
    expect(virusScanPdfInteractorMock).toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      caseId: caseDetail.docketNumber,
    });
  });
});

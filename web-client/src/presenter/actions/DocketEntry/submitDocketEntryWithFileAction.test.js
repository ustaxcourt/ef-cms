import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitDocketEntryWithFileAction } from './submitDocketEntryWithFileAction';

describe('submitDocketEntryWithFileAction', () => {
  let virusScanPdfInteractorMock;
  let validatePdfInteractorMock;
  let sanitizePdfInteractorMock;
  let fileDocketEntryInteractorMock;
  let addCoversheetInteractorMock;
  let caseDetail;

  beforeEach(() => {
    caseDetail = {
      caseId: '123',
      docketNumber: '123-45',
    };

    virusScanPdfInteractorMock = jest.fn();
    validatePdfInteractorMock = jest.fn();
    sanitizePdfInteractorMock = jest.fn();
    fileDocketEntryInteractorMock = jest.fn(() => caseDetail);
    addCoversheetInteractorMock = jest.fn();

    //updateDocketEntryInteractorMock = jest.fn(() => caseDetail);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        addCoversheetInteractor: addCoversheetInteractorMock,
        fileDocketEntryInteractor: fileDocketEntryInteractorMock,
        sanitizePdfInteractor: sanitizePdfInteractorMock,
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
    expect(sanitizePdfInteractorMock).toHaveBeenCalled();
    expect(validatePdfInteractorMock).toHaveBeenCalled();
    expect(virusScanPdfInteractorMock).toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail,
      caseId: caseDetail.docketNumber,
    });
  });
});

import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitDocketEntryAction } from './submitDocketEntryAction';

describe('submitDocketEntryAction', () => {
  let addCoversheetStub;
  let fileDocketEntryStub;
  let validatePdfStub;
  let virusScanPdfStub;
  let updateDocketEntryStub;

  beforeEach(() => {
    addCoversheetStub = jest.fn();
    fileDocketEntryStub = jest.fn();
    validatePdfStub = jest.fn();
    updateDocketEntryStub = jest.fn();
    virusScanPdfStub = jest.fn();

    presenter.providers.applicationContext = {
      ...applicationContext,
      getUniqueId: () => '123',
      getUseCases: () => ({
        addCoversheetInteractor: addCoversheetStub,
        fileDocketEntryInteractor: fileDocketEntryStub,
        updateDocketEntryInteractor: updateDocketEntryStub,
        validatePdfInteractor: validatePdfStub,
        virusScanPdfInteractor: virusScanPdfStub,
      }),
    };
  });

  it('should call fileDocketEntry', async () => {
    fileDocketEntryStub = jest.fn().mockReturnValue({ documents: [] });
    await runAction(submitDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(fileDocketEntryStub.mock.calls.length).toEqual(1);
  });

  it('should call virusScan and validation and if a file is attached', async () => {
    fileDocketEntryStub = jest.fn().mockReturnValue({
      caseId: applicationContext.getUniqueId(),
    });
    await runAction(submitDocketEntryAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: applicationContext.getUniqueId(),
      },
      state: {
        caseDetail: {
          caseId: applicationContext.getUniqueId(),
        },
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(validatePdfStub.mock.calls.length).toEqual(1);
    expect(virusScanPdfStub.mock.calls.length).toEqual(1);
  });

  it('should update docket entry with attached file', async () => {
    updateDocketEntryStub = jest.fn().mockReturnValue({
      caseId: applicationContext.getUniqueId(),
    });
    await runAction(submitDocketEntryAction, {
      modules: {
        presenter,
      },
      props: {
        primaryDocumentFileId: applicationContext.getUniqueId(),
      },
      state: {
        caseDetail: {
          caseId: applicationContext.getUniqueId(),
        },
        form: {
          primaryDocumentFile: {},
        },
        isEditingDocketEntry: true,
      },
    });

    expect(validatePdfStub.mock.calls.length).toEqual(1);
    expect(virusScanPdfStub.mock.calls.length).toEqual(1);
    expect(updateDocketEntryStub.mock.calls.length).toEqual(1);
  });
});

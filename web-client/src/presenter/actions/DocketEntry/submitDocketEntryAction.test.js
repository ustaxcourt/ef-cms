import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitDocketEntryAction } from './submitDocketEntryAction';
import sinon from 'sinon';

describe('submitDocketEntryAction', () => {
  let createCoverSheetStub;
  let fileDocketEntryStub;
  let virusScanPdfStub;
  let validatePdfStub;
  let sanitizePdfStub;
  let updateDocketEntryStub;

  beforeEach(() => {
    createCoverSheetStub = sinon.stub();
    fileDocketEntryStub = sinon.stub();
    sanitizePdfStub = sinon.stub();
    validatePdfStub = sinon.stub();
    virusScanPdfStub = sinon.stub();
    updateDocketEntryStub = sinon.stub();

    presenter.providers.applicationContext = {
      ...applicationContext,
      getUniqueId: () => '123',
      getUseCases: () => ({
        createCoverSheetInteractor: createCoverSheetStub,
        fileDocketEntryInteractor: fileDocketEntryStub,
        sanitizePdfInteractor: sanitizePdfStub,
        updateDocketEntryInteractor: updateDocketEntryStub,
        validatePdfInteractor: validatePdfStub,
        virusScanPdfInteractor: virusScanPdfStub,
      }),
    };
  });

  it('should call fileDocketEntry', async () => {
    fileDocketEntryStub.returns({ documents: [] });
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

    expect(fileDocketEntryStub.calledOnce).toEqual(true);
  });

  it('should call virusScan, validation, and sanitization if a file is attached', async () => {
    fileDocketEntryStub.returns({
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

    expect(virusScanPdfStub.calledOnce).toEqual(true);
    expect(validatePdfStub.calledOnce).toEqual(true);
    expect(sanitizePdfStub.calledOnce).toEqual(true);
  });

  it('should update docket entry with attached file', async () => {
    updateDocketEntryStub.returns({
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

    expect(virusScanPdfStub.calledOnce).toEqual(true);
    expect(validatePdfStub.calledOnce).toEqual(true);
    expect(sanitizePdfStub.calledOnce).toEqual(true);
    expect(updateDocketEntryStub.calledOnce).toEqual(true);
  });
});

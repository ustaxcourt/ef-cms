import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitDocketEntryAction } from './submitDocketEntryAction';
import sinon from 'sinon';

describe('submitDocketEntryAction', () => {
  let addCoversheetStub;
  let fileDocketEntryStub;
  let validatePdfStub;
  let virusScanPdfStub;
  let updateDocketEntryStub;

  beforeEach(() => {
    addCoversheetStub = sinon.stub();
    fileDocketEntryStub = sinon.stub();
    validatePdfStub = sinon.stub();
    updateDocketEntryStub = sinon.stub();
    virusScanPdfStub = sinon.stub();

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

  it('should call virusScan and validation and if a file is attached', async () => {
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

    expect(validatePdfStub.calledOnce).toEqual(true);
    expect(virusScanPdfStub.calledOnce).toEqual(true);
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

    expect(validatePdfStub.calledOnce).toEqual(true);
    expect(virusScanPdfStub.calledOnce).toEqual(true);
    expect(updateDocketEntryStub.calledOnce).toEqual(true);
  });
});

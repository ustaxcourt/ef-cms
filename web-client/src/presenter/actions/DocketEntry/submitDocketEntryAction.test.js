import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitDocketEntryAction } from './submitDocketEntryAction';

presenter.providers.applicationContext = applicationContext;

describe('submitDocketEntryAction', () => {
  it('should call fileDocketEntry', async () => {
    applicationContext
      .getUseCases()
      .fileDocketEntryInteractor.mockReturnValue({ documents: [] });

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

    expect(
      applicationContext.getUseCases().fileDocketEntryInteractor.mock.calls
        .length,
    ).toEqual(1);
  });

  it('should call virusScan and validation and if a file is attached', async () => {
    applicationContext.getUseCases().fileDocketEntryInteractor.mockReturnValue({
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

    expect(
      applicationContext.getUseCases().validatePdfInteractor.mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().virusScanPdfInteractor.mock.calls.length,
    ).toEqual(1);
  });

  it('should update docket entry with attached file', async () => {
    applicationContext
      .getUseCases()
      .updateDocketEntryInteractor.mockReturnValue({
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

    expect(
      applicationContext.getUseCases().validatePdfInteractor.mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().virusScanPdfInteractor.mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().updateDocketEntryInteractor.mock.calls
        .length,
    ).toEqual(1);
  });
});

import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { removeScannedPdfAction } from './removeScannedPdfAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('removeScannedPdfAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should reset the state.form properties for the given document type', async () => {
    const { state } = await runAction(removeScannedPdfAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'petition',
        },
        form: {
          petition: 'test_petition.pdf',
          petitionSize: '100',
        },
      },
    });
    expect(state.form.petition).toBeUndefined();
    expect(state.form.petitionSize).toBeUndefined();
    expect(state.form.primaryDocumentFile).toBeUndefined();
  });

  it('should return the documentUploadMode and documentType', async () => {
    const result = await runAction(removeScannedPdfAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'petition',
        },
        form: {
          petition: 'test_petition.pdf',
          petitionSize: '100',
        },
      },
    });
    expect(result.output.documentUploadMode).toEqual('scan');
    expect(result.output.documentType).toEqual('petition');
  });

  it('should call the use case for deleting the associated pdf from s3 if the docketEntry has isFileAttached true', async () => {
    await runAction(removeScannedPdfAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'petition',
        },
        form: {
          isFileAttached: true,
          petition: 'test_petition.pdf',
          petitionSize: '100',
        },
      },
    });

    expect(
      applicationContext.getUseCases().removePdfFromDocketEntryInteractor,
    ).toHaveBeenCalled();
  });
});

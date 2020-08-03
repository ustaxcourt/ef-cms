import { INITIAL_DOCUMENT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getFormDocumentUrlForPreviewAction } from './getFormDocumentUrlForPreviewAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getFormDocumentUrlForPreviewAction', () => {
  let form;

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockReturnValue({
        url: 'http://example.com',
      });
    presenter.providers.applicationContext = applicationContext;
    form = {
      docketNumber: '123-45',
      documents: [
        {
          documentId: 'test-apw-id',
          documentType:
            INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.documentType,
        },
        {
          documentId: 'test-ods-id',
          documentType: INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
        },
        {
          documentId: 'test-petition-id',
          documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
        },
        {
          documentId: 'test-rqt-id',
          documentType:
            INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
        },
        {
          documentId: 'test-stin-id',
          documentType: INITIAL_DOCUMENT_TYPES.stin.documentType,
        },
      ],
    };
  });

  it('returns the associated document url and id for the applicationForWaiverOfFilingFeeFile', async () => {
    const { output } = await runAction(getFormDocumentUrlForPreviewAction, {
      modules: {
        presenter,
      },
      state: {
        baseUrl: 'http://example.com',
        currentViewMetadata: {
          documentSelectedForPreview: 'applicationForWaiverOfFilingFeeFile',
        },
        form,
        token: 'abc',
      },
    });

    expect(output).toEqual({
      documentId: 'test-apw-id',
      pdfUrl: 'http://example.com',
    });
  });

  it('returns the associated document url and id for the ownershipDisclosureFile', async () => {
    const { output } = await runAction(getFormDocumentUrlForPreviewAction, {
      modules: {
        presenter,
      },
      state: {
        baseUrl: 'http://example.com',
        currentViewMetadata: {
          documentSelectedForPreview: 'ownershipDisclosureFile',
        },
        form,
        token: 'abc',
      },
    });

    expect(output).toEqual({
      documentId: 'test-ods-id',
      pdfUrl: 'http://example.com',
    });
  });

  it('returns the associated document url and id for the petitionFile', async () => {
    const { output } = await runAction(getFormDocumentUrlForPreviewAction, {
      modules: {
        presenter,
      },
      state: {
        baseUrl: 'http://example.com',
        currentViewMetadata: {
          documentSelectedForPreview: 'petitionFile',
        },
        form,
        token: 'abc',
      },
    });

    expect(output).toEqual({
      documentId: 'test-petition-id',
      pdfUrl: 'http://example.com',
    });
  });

  it('returns the associated document url and id for the requestForPlaceOfTrialFile', async () => {
    const { output } = await runAction(getFormDocumentUrlForPreviewAction, {
      modules: {
        presenter,
      },
      state: {
        baseUrl: 'http://example.com',
        currentViewMetadata: {
          documentSelectedForPreview: 'requestForPlaceOfTrialFile',
        },
        form,
        token: 'abc',
      },
    });

    expect(output).toEqual({
      documentId: 'test-rqt-id',
      pdfUrl: 'http://example.com',
    });
  });

  it('returns the associated document url and id for the stinFile', async () => {
    const { output } = await runAction(getFormDocumentUrlForPreviewAction, {
      modules: {
        presenter,
      },
      state: {
        baseUrl: 'http://example.com',
        currentViewMetadata: {
          documentSelectedForPreview: 'stinFile',
        },
        form,
        token: 'abc',
      },
    });

    expect(output).toEqual({
      documentId: 'test-stin-id',
      pdfUrl: 'http://example.com',
    });
  });

  it('returns undefined if the document is not found', async () => {
    const { output } = await runAction(getFormDocumentUrlForPreviewAction, {
      modules: {
        presenter,
      },
      state: {
        baseUrl: 'http://example.com',
        currentViewMetadata: {
          documentSelectedForPreview: 'stinFile',
        },
        form: {
          ...form,
          documents: [],
        },
        token: 'abc',
      },
    });

    expect(output).toEqual({ pdfUrl: undefined });
  });
});

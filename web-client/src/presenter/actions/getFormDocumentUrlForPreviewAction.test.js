import { Document } from '../../../../shared/src/business/entities/Document';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getFormDocumentUrlForPreviewAction } from './getFormDocumentUrlForPreviewAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

const { INITIAL_DOCUMENT_TYPES } = Document;

describe('getFormDocumentUrlForPreviewAction', () => {
  let form;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    form = {
      caseId: 't3-5t-c4-53-1d',
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

  it('returns the associated document url for the applicationForWaiverOfFilingFeeFile', async () => {
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
      pdfUrl:
        'http://example.com/case-documents/t3-5t-c4-53-1d/test-apw-id/document-download-url?token=abc',
    });
  });

  it('returns the associated document url for the ownershipDisclosureFile', async () => {
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
      pdfUrl:
        'http://example.com/case-documents/t3-5t-c4-53-1d/test-ods-id/document-download-url?token=abc',
    });
  });

  it('returns the associated document url for the petitionFile', async () => {
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
      pdfUrl:
        'http://example.com/case-documents/t3-5t-c4-53-1d/test-petition-id/document-download-url?token=abc',
    });
  });

  it('returns the associated document url for the requestForPlaceOfTrialFile', async () => {
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
      pdfUrl:
        'http://example.com/case-documents/t3-5t-c4-53-1d/test-rqt-id/document-download-url?token=abc',
    });
  });

  it('returns the associated document url for the stinFile', async () => {
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
      pdfUrl:
        'http://example.com/case-documents/t3-5t-c4-53-1d/test-stin-id/document-download-url?token=abc',
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

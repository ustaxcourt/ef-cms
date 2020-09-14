import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { removePdfFromCaseAction } from './removePdfFromCaseAction';
import { runAction } from 'cerebral/test';

describe('removePdfFromCaseAction', () => {
  const mockDocumentId = 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should delete the pdf associated with state.documentId when state.documentId is defined', async () => {
    const { output } = await runAction(removePdfFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        documentId: mockDocumentId,
        form: {
          docketEntries: [
            {
              documentId: mockDocumentId,
            },
            {
              documentId: '123',
            },
          ],
          docketNumber: '101-19',
        },
      },
    });

    expect(output.caseDetail.docketEntries).toEqual([
      {
        documentId: '123',
      },
    ]);
  });

  it('should delete the pdf from the form when state.currentViewMetadata.documentSelectedForPreview is defined', async () => {
    const { state } = await runAction(removePdfFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForPreview: 'applicationForWaiverOfFilingFeeFile',
        },
        form: {
          applicationForWaiverOfFilingFeeFile: {},
          applicationForWaiverOfFilingFeeFileSize: 2,
          docketEntries: [
            {
              documentId: mockDocumentId,
            },
            {
              documentId: '123',
            },
          ],
          docketNumber: '101-19',
        },
      },
    });

    expect(state.form.applicationForWaiverOfFilingFeeFile).toBeUndefined();
  });

  it('return the updated case detail', async () => {
    const { output } = await runAction(removePdfFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        documentId: mockDocumentId,
        form: {
          docketEntries: [
            {
              documentId: mockDocumentId,
            },
            {
              documentId: '123',
            },
          ],
          docketNumber: '101-19',
        },
      },
    });

    expect(output.caseDetail).toEqual({
      docketEntries: [
        {
          documentId: '123',
        },
      ],
      docketNumber: '101-19',
    });
  });

  it('return the document upload mode', async () => {
    const { output } = await runAction(removePdfFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        documentId: mockDocumentId,
        form: {
          docketEntries: [
            {
              documentId: mockDocumentId,
            },
            {
              documentId: '123',
            },
          ],
          docketNumber: '101-19',
        },
      },
    });

    expect(output.documentUploadMode).toBe('scan');
  });
});

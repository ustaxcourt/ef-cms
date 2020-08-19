import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { removePdfFromCaseAction } from './removePdfFromCaseAction';
import { runAction } from 'cerebral/test';

describe('removePdfFromCaseAction', () => {
  const mockDocumentId = 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should delete the pdf specified in props', async () => {
    const { output } = await runAction(removePdfFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        documentId: mockDocumentId,
        form: {
          docketNumber: '101-19',
          documents: [
            {
              documentId: mockDocumentId,
            },
            {
              documentId: '123',
            },
          ],
        },
      },
    });

    expect(output.caseDetail.documents).toEqual([
      {
        documentId: '123',
      },
    ]);
  });

  it('return the updated case detail', async () => {
    const { output } = await runAction(removePdfFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        documentId: mockDocumentId,
        form: {
          docketNumber: '101-19',
          documents: [
            {
              documentId: mockDocumentId,
            },
            {
              documentId: '123',
            },
          ],
        },
      },
    });

    expect(output.caseDetail).toEqual({
      docketNumber: '101-19',
      documents: [
        {
          documentId: '123',
        },
      ],
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
          docketNumber: '101-19',
          documents: [
            {
              documentId: mockDocumentId,
            },
            {
              documentId: '123',
            },
          ],
        },
      },
    });

    expect(output.documentUploadMode).toBe('scan');
  });
});

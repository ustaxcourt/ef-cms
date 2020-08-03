import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { deleteUploadedPdfAction } from './deleteUploadedPdfAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('deleteUploadedPdfAction', () => {
  const mockDocumentId = 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .deleteDocumentInteractor.mockResolvedValue(MOCK_CASE);
  });

  it('should delete the pdf specified in props', async () => {
    await runAction(deleteUploadedPdfAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-19',
        },
        documentId: mockDocumentId,
      },
    });

    expect(
      applicationContext.getUseCases().deleteDocumentInteractor.mock
        .calls[0][0],
    ).toMatchObject({
      docketNumber: '101-19',
      documentId: mockDocumentId,
    });
  });

  it('return the updated case detail', async () => {
    const { output } = await runAction(deleteUploadedPdfAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-19',
        },
        documentId: mockDocumentId,
      },
    });

    expect(output.caseDetail).toMatchObject(MOCK_CASE);
  });

  it('return the document upload mode', async () => {
    const { output } = await runAction(deleteUploadedPdfAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-19',
        },
        documentId: mockDocumentId,
      },
    });

    expect(output.documentUploadMode).toBe('scan');
  });
});

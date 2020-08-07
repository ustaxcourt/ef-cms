import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { removePdfFromCaseAction } from './removePdfFromCaseAction';
import { runAction } from 'cerebral/test';

describe('removePdfFromCaseAction', () => {
  const mockDocumentId = 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should delete the pdf specified in props', async () => {
    const { state } = await runAction(removePdfFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
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
        documentId: mockDocumentId,
      },
    });

    expect(state.caseDetail.documents).toEqual([
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
        caseDetail: {
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
        documentId: mockDocumentId,
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

  it('resets the preferredTrialCity and orderDesignatingPlaceOfTrial when a RQT is removed', async () => {
    const { output } = await runAction(removePdfFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-19',
          documents: [
            {
              documentId: mockDocumentId,
              eventCode:
                INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
            },
            {
              documentId: '123',
            },
          ],
          orderDesignatingPlaceOfTrial: false,
          preferredTrialCity: 'Brimingham, AL',
        },
        documentId: mockDocumentId,
      },
    });

    expect(output.caseDetail.preferredTrialCity).toEqual('');
    expect(output.caseDetail.orderDesignatingPlaceOfTrial).toEqual(true);
  });

  it('return the document upload mode', async () => {
    const { output } = await runAction(removePdfFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
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
        documentId: mockDocumentId,
      },
    });

    expect(output.documentUploadMode).toBe('scan');
  });
});

import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { completeWorkItemForDocumentSigningAction } from './completeWorkItemForDocumentSigningAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('completeWorkItemForDocumentSigningAction', () => {
  const { completeWorkItemInteractor } = applicationContext.getUseCases();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should complete work item if messageId is on currentViewMetadata', async () => {
    await runAction(completeWorkItemForDocumentSigningAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documents: [
            {
              documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
              workItems: [
                {
                  messages: [
                    {
                      messageId: '123',
                    },
                  ],
                },
              ],
            },
          ],
        },
        currentViewMetadata: {
          messageId: '123',
        },
        pdfForSigning: {
          documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          pageNumber: 3,
          pdfjsLib: {},
        },
      },
    });

    expect(completeWorkItemInteractor.mock.calls.length).toBe(1);
  });

  it('should do nothing if messageId is not on currentViewMetadata', async () => {
    await runAction(completeWorkItemForDocumentSigningAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documents: [
            {
              documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
              workItems: [
                {
                  messages: [
                    {
                      messageId: '123',
                    },
                  ],
                },
              ],
            },
          ],
        },
        currentViewMetadata: {},
        pdfForSigning: {
          documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          pageNumber: 3,
          pdfjsLib: {},
        },
      },
    });

    expect(completeWorkItemInteractor.mock.calls.length).toBe(0);
  });
});

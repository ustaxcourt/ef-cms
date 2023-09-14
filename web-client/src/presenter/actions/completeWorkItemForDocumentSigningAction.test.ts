import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { completeWorkItemForDocumentSigningAction } from './completeWorkItemForDocumentSigningAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

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
          docketEntries: [
            {
              docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
              workItem: {
                messages: [
                  {
                    messageId: '123',
                  },
                ],
              },
            },
          ],
          docketNumber: '123-45',
        },
        currentViewMetadata: {
          messageId: '123',
        },
        pdfForSigning: {
          docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
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
          docketEntries: [
            {
              docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
              workItem: {
                messages: [
                  {
                    messageId: '123',
                  },
                ],
              },
            },
          ],
          docketNumber: '123-45',
        },
        currentViewMetadata: {},
        pdfForSigning: {
          docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          pageNumber: 3,
          pdfjsLib: {},
        },
      },
    });

    expect(completeWorkItemInteractor.mock.calls.length).toBe(0);
  });
});

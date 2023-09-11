import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setForwardMessageModalDialogModalStateAction } from './setForwardMessageModalDialogModalStateAction';

const { PETITIONS_SECTION } = applicationContext.getConstants();

describe('setForwardMessageModalDialogModalStateAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set the modal state for forwarding a message', async () => {
    const result = await runAction(
      setForwardMessageModalDialogModalStateAction,
      {
        modules: {
          presenter,
        },
        props: {
          mostRecentMessage: {
            attachments: [
              {
                documentId: 'a5273185-f694-4d9c-bc90-71eddc5e5937',
              },
            ],
            from: 'test user 1',
            fromSection: PETITIONS_SECTION,
            fromUserId: '589002b0-dacd-4e84-874a-52d9898623c3',
            parentMessageId: '530f9b43-4934-4b2f-9aa4-50dcbe8064fa',
            subject: 'the subject',
          },
        },
        state: {
          caseDetail: {
            archivedCorrespondences: [],
            archivedDocketEntries: [],
            correspondence: [],
            docketEntries: [
              {
                docketEntryId: 'a5273185-f694-4d9c-bc90-71eddc5e5937',
                documentTitle: 'Petition',
              },
            ],
          },
        },
      },
    );

    expect(
      applicationContext.getUtilities().formatAttachments,
    ).toHaveBeenCalled();

    expect(result.state.modal).toEqual({
      form: {
        attachments: [
          {
            archived: false,
            documentId: 'a5273185-f694-4d9c-bc90-71eddc5e5937',
            documentTitle: 'Petition',
          },
        ],
        draftAttachments: [],
        from: 'test user 1',
        fromSection: PETITIONS_SECTION,
        fromUserId: '589002b0-dacd-4e84-874a-52d9898623c3',
        parentMessageId: '530f9b43-4934-4b2f-9aa4-50dcbe8064fa',
        subject: 'the subject',
      },
      validationErrors: {},
    });
  });
});

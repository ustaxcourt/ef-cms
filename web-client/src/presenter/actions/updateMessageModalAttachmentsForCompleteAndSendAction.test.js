import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { updateMessageModalAttachmentsForCompleteAndSendAction } from './updateMessageModalAttachmentsForCompleteAndSendAction';

describe('updateMessageModalAttachmentsForCompleteAndSendAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets the state.modal.form.subject to the document title returned from getDocumentTitleWithAdditionalInfo', async () => {
    const mockDocumentTitle = 'A title with additional info';

    applicationContext
      .getUtilities()
      .getDocumentTitleWithAdditionalInfo.mockReturnValue(mockDocumentTitle);

    const result = await runAction(
      updateMessageModalAttachmentsForCompleteAndSendAction,
      {
        modules: { presenter },
        props: {
          documentId: '123',
        },
        state: {
          form: {
            documentTitle: 'A title',
          },
          modal: {
            form: {
              attachments: [],
            },
          },
        },
      },
    );

    expect(result.state.modal.form.subject).toEqual(mockDocumentTitle);
  });

  it('sets the state.modal.form.attachments with the props.documentId and generated document title', async () => {
    const mockDocumentTitle = 'A title with additional info';

    applicationContext
      .getUtilities()
      .getDocumentTitleWithAdditionalInfo.mockReturnValue(mockDocumentTitle);

    const result = await runAction(
      updateMessageModalAttachmentsForCompleteAndSendAction,
      {
        modules: { presenter },
        props: {
          documentId: '123',
        },
        state: {
          form: {
            documentTitle: 'A title',
          },
          modal: {
            form: {
              attachments: [],
            },
          },
        },
      },
    );

    expect(result.state.modal.form.attachments).toEqual([
      {
        documentId: '123',
        documentTitle: mockDocumentTitle,
      },
    ]);
  });

  it('sets the documentId on attachments from state.docketEntryId if props.documentId is not set', async () => {
    const result = await runAction(
      updateMessageModalAttachmentsForCompleteAndSendAction,
      {
        modules: { presenter },
        state: {
          docketEntryId: '234',
          form: {
            documentTitle: 'A title',
          },
          modal: {
            form: {
              attachments: [],
            },
          },
        },
      },
    );

    expect(result.state.modal.form.attachments).toMatchObject([
      {
        documentId: '234',
      },
    ]);
  });
});

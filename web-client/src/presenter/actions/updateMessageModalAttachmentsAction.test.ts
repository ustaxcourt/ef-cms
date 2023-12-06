import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateMessageModalAttachmentsAction } from './updateMessageModalAttachmentsAction';

describe('updateMessageModalAttachmentsAction', () => {
  const caseDetail = {
    archivedCorrespondences: [],
    archivedDocketEntries: [],
    correspondence: [
      {
        correspondenceId: '234',
        documentTitle: 'Test Correspondence',
      },
    ],
    docketEntries: [
      {
        docketEntryId: '123',
        documentType: 'Petition',
      },
      {
        docketEntryId: '345',
        documentType:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec fringilla diam. Donec molestie metus eu purus posuere, eu porta ex aliquet. Sed metus justo, sodales sit amet vehicula a, elementum a dolor. Aliquam matis mi eget erat scelerisque pho.', // 252 chars
      },
    ],
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('appends the given document meta in props to the form.modal.attachments array', async () => {
    const result = await runAction(updateMessageModalAttachmentsAction, {
      modules: { presenter },
      props: {
        action: 'add',
        documentId: '123',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [],
            draftAttachments: [],
          },
        },
      },
    });

    expect(result.state.modal.form.attachments).toEqual([]);

    expect(result.state.modal.form.draftAttachments).toEqual([
      { documentId: '123', documentTitle: 'Petition' },
    ]);
  });

  it('should not change draftAttachments when the action is not add or remove', async () => {
    const result = await runAction(updateMessageModalAttachmentsAction, {
      modules: { presenter },
      props: {
        action: 'something',
        documentId: '123',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [],
            draftAttachments: [],
          },
        },
      },
    });

    expect(result.state.modal.form.attachments).toEqual([]);
    expect(result.state.modal.form.draftAttachments).toEqual([]);
  });

  it('removes the given document meta in props from the form.modal.attachments array', async () => {
    const result = await runAction(updateMessageModalAttachmentsAction, {
      modules: { presenter },
      props: {
        action: 'remove',
        documentId: '123',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [],
            draftAttachments: [
              { documentId: '123', documentTitle: 'Petition' },
            ],
          },
        },
      },
    });

    expect(result.state.modal.form.attachments).toEqual([]);

    expect(result.state.modal.form.draftAttachments).toEqual([]);
  });

  it('does not modify the array if no documentId is given', async () => {
    const result = await runAction(updateMessageModalAttachmentsAction, {
      modules: { presenter },
      props: {
        action: 'add',
        documentId: '',
        documentTitle: '',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [],
            draftAttachments: [],
          },
        },
      },
    });

    expect(result.state.modal.form.attachments).toEqual([]);
    expect(result.state.modal.form.draftAttachments).toEqual([]);
  });

  it('sets the form subject field if this is the first attachment to be added', async () => {
    const result = await runAction(updateMessageModalAttachmentsAction, {
      modules: { presenter },
      props: {
        action: 'add',
        documentId: '123',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [],
            draftAttachments: [],
          },
        },
      },
    });

    expect(result.state.modal.form.subject).toEqual('Petition');
  });

  it('not change form subject field if there is already an attachment', async () => {
    const result = await runAction(updateMessageModalAttachmentsAction, {
      modules: { presenter },
      props: {
        action: 'add',
        documentId: '345',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [
              {
                docketEntryId: '123',
                documentType: 'Petition',
              },
            ],
            draftAttachments: [],
            subject: 'Petition',
          },
        },
      },
    });

    expect(result.state.modal.form.subject).toEqual('Petition');
  });

  it('not change form subject field if there is already a draft attachment', async () => {
    const result = await runAction(updateMessageModalAttachmentsAction, {
      modules: { presenter },
      props: {
        action: 'add',
        documentId: '123',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [],
            draftAttachments: [
              {
                docketEntryId: '456',
                documentType: 'New Petition',
              },
            ],
            subject: 'New Petition',
          },
        },
      },
    });

    expect(result.state.modal.form.subject).toEqual('New Petition');
  });

  it('not change form subject field if all draft attachments are removed', async () => {
    const result = await runAction(updateMessageModalAttachmentsAction, {
      modules: { presenter },
      props: {
        action: 'remove',
        documentId: '123',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [],
            draftAttachments: [
              {
                docketEntryId: '123',
                documentTitle: 'Petition',
                documentType: 'New Petition',
              },
            ],
            subject: 'Petition',
          },
        },
      },
    });

    expect(result.state.modal.form.subject).toEqual('Petition');
  });

  it('truncates the document title to 250 characters when updating the subject field', async () => {
    const result = await runAction(updateMessageModalAttachmentsAction, {
      modules: { presenter },
      props: {
        action: 'add',
        documentId: '345',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [],
            draftAttachments: [],
          },
        },
      },
    });

    expect(
      result.state.modal.form.draftAttachments[0].documentTitle.length,
    ).toBeGreaterThan(250);
    expect(result.state.modal.form.subject.length).toEqual(250);
  });

  it('calls getDescriptionDisplay and returns a generated document title', async () => {
    const mockDocumentTitle = 'I was generated';
    applicationContext
      .getUtilities()
      .getDescriptionDisplay.mockReturnValue(mockDocumentTitle);

    const { state } = await runAction(updateMessageModalAttachmentsAction, {
      modules: { presenter },
      props: {
        action: 'add',
        documentId: '123',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [{}], // already contains one attachment
            draftAttachments: [],
            subject: 'Testing',
          },
        },
      },
    });

    expect(
      applicationContext.getUtilities().getDescriptionDisplay,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUtilities().getDescriptionDisplay.mock.calls[0][0],
    ).toMatchObject({ docketEntryId: '123', documentType: 'Petition' });
    expect(state.modal.form.draftAttachments[0].documentTitle).toEqual(
      mockDocumentTitle,
    );
  });
});

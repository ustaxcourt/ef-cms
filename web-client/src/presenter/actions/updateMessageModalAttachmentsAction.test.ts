import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
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

  it('appends the given document meta from props to the form.modal.attachments array', async () => {
    const result = await runAction(updateMessageModalAttachmentsAction, {
      modules: { presenter },
      props: {
        documentId: '123',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [],
          },
        },
      },
    });

    expect(result.state.modal.form.attachments).toEqual([
      { documentId: '123', documentTitle: 'Petition' },
    ]);
  });

  it('appends the given document meta from state to the form.modal.attachments array', async () => {
    const result = await runAction(updateMessageModalAttachmentsAction, {
      modules: { presenter },
      props: {
        documentId: '123',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [],
          },
        },
      },
    });

    expect(result.state.modal.form.attachments).toEqual([
      { documentId: '123', documentTitle: 'Petition' },
    ]);
  });

  it('can return case correspondence from the available documents', async () => {
    const result = await runAction(updateMessageModalAttachmentsAction, {
      modules: { presenter },
      props: {
        documentId: '234', // correspondence doc
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [],
          },
        },
      },
    });

    expect(result.state.modal.form.attachments).toEqual([
      { documentId: '234', documentTitle: 'Test Correspondence' },
    ]);
  });

  it('does not modify the array if no documentId is given', async () => {
    const result = await runAction(updateMessageModalAttachmentsAction, {
      modules: { presenter },
      props: {
        documentId: '',
        documentTitle: '',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [],
          },
        },
      },
    });

    expect(result.state.modal.form.attachments).toEqual([]);
  });

  it('sets the form subject field if this is the first attachment to be added', async () => {
    const result = await runAction(updateMessageModalAttachmentsAction, {
      modules: { presenter },
      props: {
        documentId: '123',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [],
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
        documentId: '345',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [],
          },
        },
      },
    });

    expect(
      result.state.modal.form.attachments[0].documentTitle.length,
    ).toBeGreaterThan(250);
    expect(result.state.modal.form.subject.length).toEqual(250);
  });

  it('does NOT set the form subject field if this is NOT the first attachment to be added', async () => {
    const result = await runAction(updateMessageModalAttachmentsAction, {
      modules: { presenter },
      props: {
        documentId: '123',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [{}], // already contains one attachment
            subject: 'Testing',
          },
        },
      },
    });

    expect(result.state.modal.form.subject).toEqual('Testing');
  });

  it('calls getDescriptionDisplay and returns a generated document title', async () => {
    const mockDocumentTitle = 'I was generated';
    applicationContext
      .getUtilities()
      .getDescriptionDisplay.mockReturnValue(mockDocumentTitle);

    const { state } = await runAction(updateMessageModalAttachmentsAction, {
      modules: { presenter },
      props: {
        documentId: '123',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [{}], // already contains one attachment
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
    expect(state.modal.form.attachments[1].documentTitle).toEqual(
      mockDocumentTitle,
    );
  });
});

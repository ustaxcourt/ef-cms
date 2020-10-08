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
});

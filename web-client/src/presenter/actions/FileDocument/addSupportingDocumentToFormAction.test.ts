import { addSupportingDocumentToFormAction } from './addSupportingDocumentToFormAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('addSupportingDocumentToFormAction', () => {
  it('adds first primary supporting document to form', async () => {
    const result = await runAction(addSupportingDocumentToFormAction, {
      props: {
        type: 'primary',
      },
      state: {
        form: {
          hasSupportingDocuments: false,
        },
      },
    });

    expect(result.state.form.hasSupportingDocuments).toEqual(true);
    expect(result.state.form.supportingDocuments).toEqual([
      { attachments: false, certificateOfService: false },
    ]);
  });

  it('adds third primary supporting document to form', async () => {
    const result = await runAction(addSupportingDocumentToFormAction, {
      props: {
        type: 'primary',
      },
      state: {
        form: {
          hasSupportingDocuments: true,
          supportingDocuments: [
            {
              supportingDocument: 'Something',
            },
            {
              supportingDocument: 'Something else',
            },
          ],
        },
      },
    });

    expect(result.state.form.hasSupportingDocuments).toEqual(true);
    expect(result.state.form.supportingDocuments).toEqual([
      {
        supportingDocument: 'Something',
      },
      {
        supportingDocument: 'Something else',
      },
      { attachments: false, certificateOfService: false },
    ]);
  });

  it('adds first secondary supporting document to form', async () => {
    const result = await runAction(addSupportingDocumentToFormAction, {
      props: {
        type: 'secondary',
      },
      state: {
        form: {
          hasSecondarySupportingDocuments: false,
        },
      },
    });

    expect(result.state.form.hasSecondarySupportingDocuments).toEqual(true);
    expect(result.state.form.secondarySupportingDocuments).toEqual([
      { attachments: false, certificateOfService: false },
    ]);
  });

  it('adds third secondary supporting document to form', async () => {
    const result = await runAction(addSupportingDocumentToFormAction, {
      props: {
        type: 'secondary',
      },
      state: {
        form: {
          hasSecondarySupportingDocuments: true,
          secondarySupportingDocuments: [
            {
              supportingDocument: 'Something',
            },
            {
              supportingDocument: 'Something else',
            },
          ],
        },
      },
    });

    expect(result.state.form.hasSecondarySupportingDocuments).toEqual(true);
    expect(result.state.form.secondarySupportingDocuments).toEqual([
      {
        supportingDocument: 'Something',
      },
      {
        supportingDocument: 'Something else',
      },
      { attachments: false, certificateOfService: false },
    ]);
  });
});

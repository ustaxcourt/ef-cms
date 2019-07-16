import { addSupportingDocumentToFormAction } from './addSupportingDocumentToFormAction';
import { runAction } from 'cerebral/test';

describe('addSupportingDocumentToFormAction', () => {
  it('adds first primary supporting document to form', async () => {
    const result = await runAction(addSupportingDocumentToFormAction, {
      state: {
        form: {
          hasSupportingDocuments: false,
        },
      },
      props: {
        type: 'primary'
      }
    });

    expect(result.state.form.hasSupportingDocuments).toEqual(true);
    expect(result.state.form.supportingDocuments).toEqual([{}]);
    expect(result.state.form.supportingDocumentCount).toEqual(1);
  });

  it('adds third primary supporting document to form', async () => {
    const result = await runAction(addSupportingDocumentToFormAction, {
      state: {
        form: {
          hasSupportingDocuments: true,
          supportingDocuments: [
            {
              supportingDocument: 'Something'
            },
            {
              supportingDocument: 'Something else',
            }
          ],
          supportingDocumentCount: 2,
        },
      },
      props: {
        type: 'primary'
      }
    });

    expect(result.state.form.hasSupportingDocuments).toEqual(true);
    expect(result.state.form.supportingDocuments).toEqual([
      {
        supportingDocument: 'Something'
      },
      {
        supportingDocument: 'Something else',
      },
      {}
    ]);
    expect(result.state.form.supportingDocumentCount).toEqual(3);
  });

  it('adds first secondary supporting document to form', async () => {
    const result = await runAction(addSupportingDocumentToFormAction, {
      state: {
        form: {
          hasSecondarySupportingDocuments: false,
        },
      },
      props: {
        type: 'secondary'
      }
    });

    expect(result.state.form.hasSecondarySupportingDocuments).toEqual(true);
    expect(result.state.form.secondarySupportingDocuments).toEqual([{}]);
    expect(result.state.form.secondarySupportingDocumentCount).toEqual(1);
  });

  it('adds third secondary supporting document to form', async () => {
    const result = await runAction(addSupportingDocumentToFormAction, {
      state: {
        form: {
          hasSecondarySupportingDocuments: true,
          secondarySupportingDocuments: [
            {
              supportingDocument: 'Something'
            },
            {
              supportingDocument: 'Something else',
            }
          ],
          secondarySupportingDocumentCount: 2,
        },
      },
      props: {
        type: 'secondary'
      }
    });

    expect(result.state.form.hasSecondarySupportingDocuments).toEqual(true);
    expect(result.state.form.secondarySupportingDocuments).toEqual([
      {
        supportingDocument: 'Something'
      },
      {
        supportingDocument: 'Something else',
      },
      {}
    ]);
    expect(result.state.form.secondarySupportingDocumentCount).toEqual(3);
  });
});

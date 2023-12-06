import { clearWizardDataAction } from './clearWizardDataAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearWizardDataAction', () => {
  it('clears document scenario with "category" key', async () => {
    const result = await runAction(clearWizardDataAction, {
      props: {
        key: 'category',
      },
      state: {
        form: {
          category: 'what',
          something: 'other',
        },
      },
    });

    expect(result.state.form).toEqual({
      category: 'what',
    });
  });
  it('clears certificateOfServiceDate', async () => {
    const result = await runAction(clearWizardDataAction, {
      props: {
        key: 'certificateOfService',
      },
      state: {
        form: {
          certificateOfServiceDate: 'blah',
        },
      },
    });

    expect(result.state.form.certificateOfServiceDate).toBeUndefined();
  });
  it('clears document scenario with "documentType" key', async () => {
    const result = await runAction(clearWizardDataAction, {
      props: {
        key: 'documentType',
      },
      state: {
        form: {
          category: 'what',
          cowLevel: 'none',
          documentType: 'other',
        },
      },
    });

    expect(result.state.form).toEqual({
      category: 'what',
      documentType: 'other',
    });
  });
  it("clears document scenario, but preserves secondaryDocument's category key", async () => {
    const result = await runAction(clearWizardDataAction, {
      props: {
        key: 'secondaryDocument.category',
      },
      state: {
        form: {
          secondaryDocument: {
            category: 'what',
            documentType: 'another document type',
          },
        },
      },
    });

    expect(result.state.form.secondaryDocument).toEqual({
      category: 'what',
    });
  });
  it("clears document scenario, but preserves the secondaryDocument's documentType and category keys", async () => {
    const result = await runAction(clearWizardDataAction, {
      props: {
        key: 'secondaryDocument.documentType',
      },
      state: {
        form: {
          secondaryDocument: {
            category: 'what',
            documentType: 'other',
            foo: 'bar',
          },
        },
      },
    });

    expect(result.state.form.secondaryDocument).toEqual({
      category: 'what',
      documentType: 'other',
    });
  });
});

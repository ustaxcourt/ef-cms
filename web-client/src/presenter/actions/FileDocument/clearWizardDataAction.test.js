import { clearWizardDataAction } from './clearWizardDataAction';
import { runAction } from 'cerebral/test';

describe('clearSecondaryDocumentScenarioAction', () => {
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

    expect(result.state.form.certificateOfServiceDate).toEqual(null);
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
  it('clears document scenario with "hasSupportingDocuments" key', async () => {
    const result = await runAction(clearWizardDataAction, {
      props: {
        key: 'hasSupportingDocuments',
      },
      state: {
        form: {
          supportingDocument: 'test',
          supportingDocumentFile: {},
          supportingDocumentFreeText: 'test',
          supportingDocumentMetadata: 'test',
        },
      },
    });

    expect(result.state.form).toEqual({
      supportingDocument: null,
      supportingDocumentFile: null,
      supportingDocumentFreeText: null,
      supportingDocumentMetadata: null,
    });
  });
  it('clears document scenario with "supportingDocument" key', async () => {
    const result = await runAction(clearWizardDataAction, {
      props: {
        key: 'supportingDocument',
      },
      state: {
        form: {
          supportingDocumentFreeText: 'test',
        },
      },
    });

    expect(result.state.form).toEqual({
      supportingDocumentFreeText: null,
    });
  });
  it('clears document scenario with "secondaryDocumentFile" key', async () => {
    const result = await runAction(clearWizardDataAction, {
      props: {
        key: 'secondaryDocumentFile',
      },
      state: {
        form: {
          hasSecondarySupportingDocuments: true,
          secondarySupportingDocument: 'test',
          secondarySupportingDocumentFile: {},
          secondarySupportingDocumentFreeText: 'test',
          secondarySupportingDocumentMetadata: 'test',
        },
      },
    });

    expect(result.state.form).toEqual({
      hasSecondarySupportingDocuments: null,
      secondarySupportingDocument: null,
      secondarySupportingDocumentFile: null,
      secondarySupportingDocumentFreeText: null,
      secondarySupportingDocumentMetadata: null,
    });
  });
  it('clears document scenario with "hasSecondarySupportingDocuments" key', async () => {
    const result = await runAction(clearWizardDataAction, {
      props: {
        key: 'hasSecondarySupportingDocuments',
      },
      state: {
        form: {
          secondarySupportingDocument: 'test',
          secondarySupportingDocumentFile: {},
          secondarySupportingDocumentFreeText: 'test',
          secondarySupportingDocumentMetadata: 'test',
        },
      },
    });

    expect(result.state.form).toEqual({
      secondarySupportingDocument: null,
      secondarySupportingDocumentFile: null,
      secondarySupportingDocumentFreeText: null,
      secondarySupportingDocumentMetadata: null,
    });
  });
  it('clears document scenario with "secondarySupportingDocument" key', async () => {
    const result = await runAction(clearWizardDataAction, {
      props: {
        key: 'secondarySupportingDocument',
      },
      state: {
        form: {
          secondarySupportingDocumentFreeText: 'test',
        },
      },
    });

    expect(result.state.form).toEqual({
      secondarySupportingDocumentFreeText: null,
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

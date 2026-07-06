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

  it('clears unrelated form fields when secondaryDocument.documentType changes, preserving only primary document fields', async () => {
    const result = await runAction(clearWizardDataAction, {
      props: {
        key: 'secondaryDocument.documentType',
      },
      state: {
        form: {
          category: 'Motion',
          documentTitle: 'Motion for Leave to File',
          documentType: 'Motion for Leave to File',
          eventCode: 'MCLF',
          scenario: 'Standard',
          primaryDocumentFile: { name: 'test.pdf' },
          supportingDocuments: [{ documentTitle: 'Brief' }],
          freeText: 'some old text',
          ordinalValue: '1st',
          previousDocument: { documentTitle: 'Old Document' },
          secondaryDocument: {
            category: 'Information',
            documentType: 'Statement',
            freeText: 'stale secondary text',
            previousDocument: { documentTitle: 'Stale Ref' },
          },
        },
      },
    });

    expect(result.state.form).toEqual({
      category: 'Motion',
      documentTitle: 'Motion for Leave to File',
      documentType: 'Motion for Leave to File',
      eventCode: 'MCLF',
      scenario: 'Standard',
      secondaryDocument: {
        category: 'Information',
        documentType: 'Statement',
      },
    });
  });

  it('does not retain uploaded document files or free-text fields after secondaryDocument.documentType change', async () => {
    const result = await runAction(clearWizardDataAction, {
      props: {
        key: 'secondaryDocument.documentType',
      },
      state: {
        form: {
          category: 'Motion',
          documentTitle: 'Motion to Dismiss',
          documentType: 'Motion to Dismiss',
          eventCode: 'MTD',
          scenario: 'Standard',
          primaryDocumentFile: { name: 'motion.pdf', size: 12345 },
          primaryDocumentFileSize: 12345,
          secondaryDocumentFile: { name: 'exhibit.pdf', size: 99999 },
          secondaryDocumentFileSize: 99999,
          supportingDocuments: [
            { documentTitle: 'Declaration', supportingDocumentFile: {} },
          ],
          freeText: 'retained in error',
          freeText2: 'also retained in error',
          secondaryDocument: {
            category: 'Supporting Document',
            documentType: 'Declaration',
            freeText: 'secondary free text',
          },
        },
      },
    });

    expect(result.state.form.primaryDocumentFile).toBeUndefined();
    expect(result.state.form.primaryDocumentFileSize).toBeUndefined();
    expect(result.state.form.secondaryDocumentFile).toBeUndefined();
    expect(result.state.form.secondaryDocumentFileSize).toBeUndefined();
    expect(result.state.form.supportingDocuments).toBeUndefined();
    expect(result.state.form.freeText).toBeUndefined();
    expect(result.state.form.freeText2).toBeUndefined();
    expect(result.state.form.secondaryDocument.freeText).toBeUndefined();

    expect(result.state.form.category).toBe('Motion');
    expect(result.state.form.documentType).toBe('Motion to Dismiss');
    expect(result.state.form.documentTitle).toBe('Motion to Dismiss');
    expect(result.state.form.eventCode).toBe('MTD');
    expect(result.state.form.scenario).toBe('Standard');
    expect(result.state.form.secondaryDocument).toEqual({
      category: 'Supporting Document',
      documentType: 'Declaration',
    });
  });
});

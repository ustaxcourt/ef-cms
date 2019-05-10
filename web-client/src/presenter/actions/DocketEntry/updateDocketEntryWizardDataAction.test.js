import { runAction } from 'cerebral/test';
import { updateDocketEntryWizardDataAction } from './updateDocketEntryWizardDataAction';

const caseDetail = {
  documents: [
    {
      documentId: '1',
      documentTitle: 'A Document',
      documentType: 'A Document',
    },
    {
      documentId: '2',
      documentTitle: 'B Document',
      documentType: 'B Document',
    },
    {
      documentId: '3',
      documentTitle: 'C Document',
      documentType: 'C Document',
      relationship: 'primaryDocument',
    },
  ],
};

describe('updateDocketEntryWizardDataAction', () => {
  it('clear Certificate Of Service date items when certificateOfService is updated', async () => {
    const result = await runAction(updateDocketEntryWizardDataAction, {
      props: {
        key: 'certificateOfService',
      },
      state: {
        constants: {
          INTERNAL_CATEGORY_MAP: [],
        },
        form: {
          certificateOfServiceDate: '12-12-1212',
          certificateOfServiceDay: 12,
          certificateOfServiceMonth: 12,
          certificateOfServiceYear: 12,
        },
      },
    });
    expect(result.state.form.certificateOfServiceDate).toEqual(undefined);
    expect(result.state.form.certificateOfServiceDay).toEqual(undefined);
    expect(result.state.form.certificateOfServiceMonth).toEqual(undefined);
    expect(result.state.form.certificateOfServiceYear).toEqual(undefined);
  });

  it('unsets form state values when props.key=eventCode', async () => {
    const result = await runAction(updateDocketEntryWizardDataAction, {
      props: {
        key: 'eventCode',
      },
      state: {
        constants: {
          INTERNAL_CATEGORY_MAP: ['documentTitle'],
        },
        form: {
          documentTitle: 'document title',
          secondaryDocument: {
            freeText: 'Guy Fieri is my spirit animal.',
            ordinalValue: 'asdf',
            previousDocument: {},
            serviceDate: new Date(),
            trialLocation: 'Flavortown',
          },
        },
      },
    });

    expect(result.state.form).toEqual({});
  });

  it('sets default previousDocument and metadata when props.key=eventCode, state.screenMetadata.supporting is true, and there is only one previous document', async () => {
    const result = await runAction(updateDocketEntryWizardDataAction, {
      props: {
        key: 'eventCode',
      },
      state: {
        caseDetail,
        constants: {
          INTERNAL_CATEGORY_MAP: ['documentTitle'],
        },
        form: {
          documentTitle: 'document title',
          secondaryDocument: {
            freeText: 'Guy Fieri is my spirit animal.',
            ordinalValue: 'asdf',
            previousDocument: {},
            serviceDate: new Date(),
            trialLocation: 'Flavortown',
          },
        },
        screenMetadata: {
          filedDocumentIds: ['3'],
          primary: { something: true, somethingElse: false },
          supporting: true,
        },
      },
    });

    expect(result.state.form.previousDocument).toEqual('C Document');
    expect(result.state.form).toEqual({
      previousDocument: 'C Document',
      something: true,
      somethingElse: false,
    });
  });

  it('does not set default previousDocument and metadata when props.key=eventCode, state.screenMetadata.supporting is true, but there is more than one previous document', async () => {
    const result = await runAction(updateDocketEntryWizardDataAction, {
      props: {
        key: 'eventCode',
      },
      state: {
        caseDetail,
        constants: {
          INTERNAL_CATEGORY_MAP: ['documentTitle'],
        },
        form: {
          documentTitle: 'document title',
          secondaryDocument: {
            freeText: 'Guy Fieri is my spirit animal.',
            ordinalValue: 'asdf',
            previousDocument: {},
            serviceDate: new Date(),
            trialLocation: 'Flavortown',
          },
        },
        screenMetadata: {
          filedDocumentIds: ['2', '3'],
          primary: { something: true, somethingElse: false },
          secondary: { something: true, somethingElse: false },
          supporting: true,
        },
      },
    });

    expect(result.state.form.previousDocument).toEqual(undefined);
    expect(result.state.form).toEqual({});
  });

  it('unsets secondaryDocument form state values', async () => {
    const result = await runAction(updateDocketEntryWizardDataAction, {
      props: {
        key: 'secondaryDocument.eventCode',
      },
      state: {
        constants: {
          INTERNAL_CATEGORY_MAP: ['documentTitle'],
        },
        form: {
          documentTitle: 'document title',
          secondaryDocument: {
            freeText: 'Guy Fieri is my spirit animal.',
            ordinalValue: 'asdf',
            previousDocument: {},
            serviceDate: new Date(),
            trialLocation: 'Flavortown',
          },
        },
      },
    });

    expect(result.state.form).toEqual({
      documentTitle: 'document title',
    });
  });

  it('unsets additionalInfo if empty', async () => {
    const result = await runAction(updateDocketEntryWizardDataAction, {
      props: {
        key: 'additionalInfo',
      },
      state: {
        constants: {
          INTERNAL_CATEGORY_MAP: ['documentTitle'],
        },
        form: {
          additionalInfo: '',
          documentTitle: 'document title',
        },
      },
    });

    expect(result.state.form.additionalInfo).toEqual(undefined);
  });

  it('unsets additionalInfo2 if empty', async () => {
    const result = await runAction(updateDocketEntryWizardDataAction, {
      props: {
        key: 'additionalInfo2',
      },
      state: {
        constants: {
          INTERNAL_CATEGORY_MAP: ['documentTitle'],
        },
        form: {
          additionalInfo2: '',
          documentTitle: 'document title',
        },
      },
    });

    expect(result.state.form.additionalInfo2).toEqual(undefined);
  });
});

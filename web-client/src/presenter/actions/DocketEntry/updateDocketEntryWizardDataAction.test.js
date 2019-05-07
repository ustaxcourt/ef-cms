import { runAction } from 'cerebral/test';
import { updateDocketEntryWizardDataAction } from './updateDocketEntryWizardDataAction';

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
});

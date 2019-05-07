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
    expect(result.state.form.certificateOfServiceDate).toEqual(null);
    expect(result.state.form.certificateOfServiceDay).toEqual(null);
    expect(result.state.form.certificateOfServiceMonth).toEqual(null);
    expect(result.state.form.certificateOfServiceYear).toEqual(null);
  });

  it('clears form values when props.key=eventCode', async () => {
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

    expect(result.state.form).toEqual({
      freeText: null,
      ordinalValue: null,
      previousDocument: null,
      secondaryDocument: null,
      serviceDate: null,
      trialLocation: null,
    });
  });

  it('clears secondaryDocument form items', async () => {
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
      secondaryDocument: {
        freeText: null,
        ordinalValue: null,
        previousDocument: null,
        serviceDate: null,
        trialLocation: null,
      },
    });
  });
});

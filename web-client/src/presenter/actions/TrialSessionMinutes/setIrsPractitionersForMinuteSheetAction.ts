import { state } from '@web-client/presenter/app.cerebral';

export const setIrsPractitionersForMinuteSheetAction = ({ props, store }) => {
  const { irsPractitioners } = props;

  const irsPractitionerOptions = irsPractitioners
    .filter(
      irsPractitioner =>
        irsPractitioner.admissionsStatus === 'Active' &&
        irsPractitioner.practiceType === 'IRS',
    )
    .map(irsPractitioner => {
      return {
        label: irsPractitioner.name,
        value: irsPractitioner.name,
      };
    });

  store.set(
    state.minuteSheetForm.options.irsPractitionerOptions,
    irsPractitionerOptions,
  );
};

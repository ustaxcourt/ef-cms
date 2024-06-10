import { state } from '@web-client/presenter/app.cerebral';

export const setRepresentAPartyWizardStepActionGenerator = (
  wizardStep,
): (({ store }) => void) => {
  return ({ store }): void => {
    store.set(state.wizardStep, wizardStep);
  };
};

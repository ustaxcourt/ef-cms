import { state } from '@web-client/presenter/app.cerebral';

export const unsetRepresentAPartyWizardStepAction = ({
  store,
}: ActionProps): void => {
  store.unset(state.wizardStep);
};

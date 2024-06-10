import { state } from '@web-client/presenter/app.cerebral';

export const unsetCaseAssociationWizardStepAction = ({
  store,
}: ActionProps): void => {
  store.unset(state.wizardStep);
};

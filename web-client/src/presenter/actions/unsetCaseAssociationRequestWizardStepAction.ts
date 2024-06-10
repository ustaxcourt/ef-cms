import { state } from '@web-client/presenter/app.cerebral';

export const unsetCaseAssociationRequestWizardStepAction = ({
  store,
}: ActionProps): void => {
  store.unset(state.wizardStep);
};

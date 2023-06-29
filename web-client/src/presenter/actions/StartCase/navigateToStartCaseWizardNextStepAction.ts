import { state } from '@web-client/presenter/app.cerebral';

/**
 * changes the route to the next step (the step passed in via props.nextStep)
 * for the start case wizard
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props that contain the props.nextStep
 * @param {object} providers.store the cerebral store function to store state.wizardStep
 */
export const navigateToStartCaseWizardNextStepAction = async ({
  props,
  router,
  store,
}: ActionProps) => {
  const { nextStep } = props;
  store.set(state.wizardStep, `StartCaseStep${nextStep}`);
  await router.route(`/file-a-petition/step-${nextStep}`);
};

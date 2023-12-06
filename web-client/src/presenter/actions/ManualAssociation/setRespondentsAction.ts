import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.modal.respondentMatches; also defaults the state.modal.user if only one respondent
 * was found
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.irsPractitioners
 * @param {object} providers.store the cerebral store used for setting the state.modal.respondentMatches
 */
export const setRespondentsAction = ({ props, store }: ActionProps) => {
  const respondentMatches = props.irsPractitioners;

  store.set(state.modal.respondentMatches, respondentMatches);

  if (respondentMatches.length === 1) {
    //if there is only one result, default select that option on the form
    store.set(state.modal.user, respondentMatches[0]);
  }
};

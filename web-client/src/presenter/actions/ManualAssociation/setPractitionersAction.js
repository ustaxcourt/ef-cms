import { state } from 'cerebral';

/**
 * sets the state.modal.practitionerMatches; also defaults the state.modal.user if only one practitioner
 * was found
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.privatePractitioners
 * @param {object} providers.store the cerebral store used for setting the state.modal.practitionerMatches
 */
export const setPractitionersAction = ({ props, store }) => {
  const practitionerMatches = props.privatePractitioners;

  store.set(state.modal.practitionerMatches, practitionerMatches);

  if (practitionerMatches.length === 1) {
    //if there is only one result, default select that option on the form
    store.set(state.modal.user, practitionerMatches[0]);
  }

  store.set(state.modal.representingMap, {});
};

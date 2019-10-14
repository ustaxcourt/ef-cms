import { state } from 'cerebral';

/**
 * sets the state.modal.practitionerMatches; also defaults the state.modal.user if only one practitioner
 * was found
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.practitioners
 * @param {object} providers.store the cerebral store used for setting the state.modal.practitionerMatches
 */
export const setPractitionersAction = ({ get, props, store }) => {
  const practitionerMatches = props.practitioners;
  const caseDetail = get(state.caseDetail);

  const practitionerMatchesWithExistsFlag = practitionerMatches.map(
    practitionerMatch => ({
      ...practitionerMatch,
      isAlreadyInCase: caseDetail.practitioners.find(
        practitioner => practitioner.userId === practitionerMatch.userId,
      ),
    }),
  );
  store.set(state.modal.practitionerMatches, practitionerMatchesWithExistsFlag);

  if (practitionerMatchesWithExistsFlag.length === 1) {
    //if there is only one result, default select that option on the form
    store.set(state.modal.user, practitionerMatchesWithExistsFlag[0]);
  }
};

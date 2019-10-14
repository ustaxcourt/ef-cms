import { state } from 'cerebral';

/**
 * sets the state.modal.respondentMatches; also defaults the state.modal.user if only one respondent
 * was found
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.respondents
 * @param {object} providers.store the cerebral store used for setting the state.modal.respondentMatches
 */
export const setRespondentsAction = ({ get, props, store }) => {
  const respondentMatches = props.respondents;
  const caseDetail = get(state.caseDetail);

  const respondentMatchesWithExistsFlag = respondentMatches.map(
    respondentMatch => ({
      ...respondentMatch,
      isAlreadyInCase: caseDetail.respondents.find(
        respondent => respondent.userId === respondentMatch.userId,
      ),
    }),
  );

  store.set(state.modal.respondentMatches, respondentMatchesWithExistsFlag);

  if (respondentMatchesWithExistsFlag.length === 1) {
    //if there is only one result, default select that option on the form
    store.set(state.modal.user, respondentMatchesWithExistsFlag[0]);
  }
};

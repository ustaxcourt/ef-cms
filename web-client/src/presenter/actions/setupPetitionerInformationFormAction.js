import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

/**
 * populates the form with the necessary fields to so that the edit petitioner information page works.
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.caseDetail
 * @param {object} providers.store the cerebral store used for setting the state.caseDetail
 */
export const setupPetitionerInformationFormAction = ({
  applicationContext,
  get,
  store,
}) => {
  const caseDetail = get(state.caseDetail);

  const formattedCaseDetail = applicationContext
    .getUtilities()
    .setServiceIndicatorsForCase({
      ...caseDetail,
    });

  store.set(
    state.form,
    cloneDeep({
      contactPrimary: formattedCaseDetail.contactPrimary,
      contactSecondary: formattedCaseDetail.contactSecondary,
      partyType: formattedCaseDetail.partyType,
    }),
  );
};

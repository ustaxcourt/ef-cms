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

  const contactPrimary = applicationContext
    .getUtilities()
    .getContactPrimary(formattedCaseDetail);

  const contactSecondary = applicationContext
    .getUtilities()
    .getContactSecondary(formattedCaseDetail);

  store.set(
    state.form,
    cloneDeep({
      contactPrimary,
      contactSecondary,
      partyType: formattedCaseDetail.partyType,
    }),
  );
};

import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

/**
 * populates the form with the necessary fields to so that the edit petitioner information page works.
 *
 * @param {object} providers the providers object
 * @param {Function} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object containing the props.caseDetail
 * @param {object} providers.store the cerebral store used for setting the state.caseDetail
 */
export const setupPetitionerContactInformationFormAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const caseDetail = get(state.caseDetail);
  const { contactId } = props;

  const formattedCaseDetail = applicationContext
    .getUtilities()
    .setServiceIndicatorsForCase({
      ...caseDetail,
    });

  const contactToSet = applicationContext
    .getUtilities()
    .getPetitionerById(formattedCaseDetail, contactId);

  store.set(
    state.form,
    cloneDeep({
      contact: { ...contactToSet, currentEmail: contactToSet.email },
      isAddressSealed: contactToSet.isAddressSealed,
    }),
  );
};

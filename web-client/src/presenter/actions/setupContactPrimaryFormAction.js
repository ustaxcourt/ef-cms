import { state } from 'cerebral';

/**
 * sets the state.form from props.caseDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setupContactPrimaryFormAction = ({
  applicationContext,
  props,
  store,
}) => {
  const { caseDetail } = props;
  store.set(state.form.docketNumber, caseDetail.docketNumber);
  store.set(
    state.form.contactPrimary,
    applicationContext.getUtilities().getContactPrimary(caseDetail),
  );
  store.set(state.form.partyType, caseDetail.partyType);
};

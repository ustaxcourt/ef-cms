import { state } from 'cerebral';

/**
 * sets state.form.orderForOds based on the partyType and whether an ODS file has been uploaded
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const updateOrderForOdsAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  if (['ownershipDisclosureFile', 'partyType'].includes(props.key)) {
    const { ownershipDisclosureFile, partyType } = get(state.form);
    const { PARTY_TYPES } = applicationContext.getConstants();

    if (
      [
        PARTY_TYPES.partnershipAsTaxMattersPartner,
        PARTY_TYPES.partnershipOtherThanTaxMatters,
        PARTY_TYPES.partnershipBBA,
        PARTY_TYPES.corporation,
      ].includes(partyType) &&
      !ownershipDisclosureFile
    ) {
      store.set(state.form.orderForOds, true);
    } else {
      store.set(state.form.orderForOds, false);
    }
  }
};

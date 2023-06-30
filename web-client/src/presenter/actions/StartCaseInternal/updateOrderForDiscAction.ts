import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets state.form.orderForDisc based on the partyType and whether an DISC file has been uploaded
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const updateOrderForDiscAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  if (['corporateDisclosureFile', 'partyType'].includes(props.key)) {
    const { corporateDisclosureFile, partyType } = get(state.form);
    const { PARTY_TYPES } = applicationContext.getConstants();

    if (
      [
        PARTY_TYPES.partnershipAsTaxMattersPartner,
        PARTY_TYPES.partnershipOtherThanTaxMatters,
        PARTY_TYPES.partnershipBBA,
        PARTY_TYPES.corporation,
      ].includes(partyType) &&
      !corporateDisclosureFile
    ) {
      store.set(state.form.orderForDisc, true);
    } else {
      store.set(state.form.orderForDisc, false);
    }
  }
};

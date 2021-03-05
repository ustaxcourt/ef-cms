import { state } from 'cerebral';

/* sets state.form.partyIrsPractitioner to true
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const setFormPartyIrsPractitionerTrueAction = async ({ store }) => {
  store.set(state.form.partyIrsPractitioner, true);
};

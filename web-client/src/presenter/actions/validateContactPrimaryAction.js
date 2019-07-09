import { state } from 'cerebral';

/**
 * Creates and appends a new "blank" year amount object to the yearAmounts array for when a user needs to add another
 * year amount to the petition document info.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {Function} providers.get the cerebral get helper function
 */
export const validateContactPrimaryAction = ({
  applicationContext,
  get,
  store,
}) => {
  const contactInfo = get(state.contactToEdit.contactPrimary);
  const partyType = get(state.caseDetail.partyType);

  const errors = applicationContext
    .getUseCases()
    .validatePrimaryContactInteractor({
      contactInfo,
      partyType,
    });

  store.set(state.validationErrors.contactPrimary, errors || {});
};

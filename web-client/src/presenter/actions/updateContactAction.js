import { state } from 'cerebral';

/**
 * updates contact information
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {object} alertSuccess, docketNumber
 */
export const updateContactAction = async ({ applicationContext, get }) => {
  const { contact, docketNumber } = get(state.form);

  const updatedCase = await applicationContext
    .getUseCases()
    .updateContactInteractor(applicationContext, {
      contactInfo: contact,
      docketNumber,
    });

  return {
    alertSuccess: {
      message: 'Changes saved.',
    },
    docketNumber: updatedCase.docketNumber,
  };
};

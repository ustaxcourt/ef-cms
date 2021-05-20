import { capitalize } from 'lodash';
import { state } from 'cerebral';

/**
 * updates the petitioner information action
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {object} alertSuccess, caseDetail, docketNumber, paperServiceParties, pdfUrl, tab
 */
export const addPetitionerToCaseAction = async ({
  applicationContext,
  get,
}) => {
  const { docketNumber } = get(state.caseDetail);
  const { contact } = get(state.form);

  const updatedCase = await applicationContext
    .getUseCases()
    .addPetitionerToCaseInteractor(applicationContext, {
      caseCaption: contact.caseCaption,
      contact,
      docketNumber,
    });

  return {
    alertSuccess: {
      message: `${capitalize(contact.contactType)} ${
        contact.name
      } has been added to the case.`,
    },
    caseDetail: updatedCase,
    docketNumber,
    tab: 'caseInfo',
  };
};

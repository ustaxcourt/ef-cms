import { state } from 'cerebral';

/**
 * Generates a printable receipt for document filing
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.router the riot.router object that is used for creating the URL
 * @returns {object} props containing printReceiptLink
 */

export const generatePrintableFilingReceiptAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const { documentsFiled } = props;
  const docketNumber = get(state.caseDetail.docketNumber);

  const filingReceiptUrl = await applicationContext
    .getUseCases()
    .generatePrintableFilingReceiptInteractor(applicationContext, {
      docketNumber,
      documentsFiled,
    });

  return { printReceiptLink: filingReceiptUrl };
};

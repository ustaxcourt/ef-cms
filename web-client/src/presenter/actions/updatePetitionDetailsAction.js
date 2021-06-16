import { state } from 'cerebral';

/**
 * updates petition fee payment information on a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {object} providers.get the cerebral store used for getting state.form
 * @param {object} providers.props the cerebral props object containing props.irsNoticeDate, props.petitionPaymentDate, and props.petitionPaymentWaivedDate
 * @returns {object} alertSuccess, docketNumber, tab, caseDetail
 */
export const updatePetitionDetailsAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const form = get(state.form);
  const { irsNoticeDate, petitionPaymentDate, petitionPaymentWaivedDate } =
    props;

  const updatedCase = await applicationContext
    .getUseCases()
    .updatePetitionDetailsInteractor(applicationContext, {
      docketNumber,
      petitionDetails: {
        ...form,
        irsNoticeDate,
        petitionPaymentDate,
        petitionPaymentWaivedDate,
        preferredTrialCity: form.preferredTrialCity
          ? form.preferredTrialCity
          : null,
      },
    });

  return {
    alertSuccess: {
      message: 'Changes saved.',
    },
    caseDetail: updatedCase,
    docketNumber,
    tab: 'caseInfo',
  };
};

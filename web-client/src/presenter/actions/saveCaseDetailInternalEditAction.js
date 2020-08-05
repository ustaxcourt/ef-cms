import { omit } from 'lodash';
import { setupPercentDone } from './createCaseFromPaperAction';
import { state } from 'cerebral';

/**
 * takes the state.caseDetail and updates it via the updateCase use case.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the updateCase use case
 * @param {object} providers.get the cerebral store used for getting state.caseDetail
 * @param {object} providers.props the cerebral store used for getting props.formWithComputedDates
 * @returns {object} the alertSuccess and the caseDetail
 */
export const saveCaseDetailInternalEditAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const { STATUS_TYPES } = applicationContext.getConstants();
  const { formWithComputedDates } = props;
  const caseToUpdate = formWithComputedDates || get(state.form);
  const caseDetailBleh = get(state.caseDetail);

  const {
    applicationForWaiverOfFilingFeeFile,
    ownershipDisclosureFile,
    petitionFile,
    requestForPlaceOfTrialFile,
    stinFile,
  } = get(state.form);

  const receivedAt = // AAAA-BB-CC
    (props.receivedAt &&
      applicationContext
        .getUtilities()
        .prepareDateFromString(props.receivedAt)
        .toISOString()) ||
    null;

  const form = omit(
    {
      ...get(state.form),
      petitionPaymentDate: props.petitionPaymentDate,
      petitionPaymentWaivedDate: props.petitionPaymentWaivedDate,
      receivedAt,
    },
    ['receivedAtYear', 'receivedAtMonth', 'receivedAtDay'],
  );

  const progressFunctions = setupPercentDone(
    {
      ownership: ownershipDisclosureFile,
      petition: petitionFile,
      stin: stinFile,
      trial: requestForPlaceOfTrialFile,
      waiverOfFilingFee: applicationForWaiverOfFilingFeeFile,
    },
    store,
  );

  console.log(form.docketNumber, stinFile, progressFunctions.stin);

  let caseDetail;
  try {
    caseDetail = await applicationContext
      .getUseCases()
      .filePetitionFromPaperInteractor({
        applicationContext,
        applicationForWaiverOfFilingFeeFile,
        applicationForWaiverOfFilingFeeUploadProgress:
          progressFunctions.waiverOfFilingFee,
        caseDetail: caseDetailBleh,
        ownershipDisclosureFile,
        ownershipDisclosureUploadProgress: progressFunctions.ownership,
        petitionFile,
        petitionMetadata: form,
        petitionUploadProgress: progressFunctions.petition,
        requestForPlaceOfTrialFile,
        requestForPlaceOfTrialUploadProgress: progressFunctions.trial,
        stinFile,
        stinUploadProgress: progressFunctions.stin,
      });
  } catch (e) {
    console.log(e);
  }

  console.log('here 2');

  caseDetail = await applicationContext
    .getUseCases()
    .saveCaseDetailInternalEditInteractor({
      applicationContext,
      caseToUpdate,
    });

  console.log('here 3');

  if (caseDetail.status === STATUS_TYPES.generalDocketReadyForTrial) {
    await applicationContext.getUseCases().updateCaseTrialSortTagsInteractor({
      applicationContext,
      docketNumber: caseDetail.docketNumber,
    });
  }

  return {
    alertSuccess: {
      message: `Case ${caseDetail.docketNumber} updated.`,
    },
    caseDetail,
  };
};

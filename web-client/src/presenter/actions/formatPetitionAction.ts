import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { state } from '@web-client/presenter/app.cerebral';

export const formatPetitionAction = ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  const petitionInfo = {
    ...props.step1Data,
    ...props.step2Data,
    ...props.step3Data,
    ...props.step4Data,
    ...props.step5Data,
  };

  const caseCaption =
    applicationContext
      .getUtilities()
      .getCaseCaption({ ...petitionInfo, petitioners: [] }) || '';

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta({
    caseCaption,
  });

  const { CASE_TYPES_MAP } = applicationContext.getConstants();
  const disclosureCaseTypes = ['Disclosure1', 'Disclosure2'];

  if (disclosureCaseTypes.includes(petitionInfo.caseType)) {
    petitionInfo.caseType = CASE_TYPES_MAP.disclosure;
  }

  const { contactPrimary, irsNotices } = petitionInfo;

  const user = applicationContext.getCurrentUser();
  contactPrimary.email = user.email;

  let noticeIssuedDate;
  let taxYear;

  if (irsNotices[0]) {
    ({ noticeIssuedDate, taxYear } = irsNotices[0]);
  }

  store.set(state.petitionFormatted, {
    ...petitionInfo,
    caseCaption,
    caseCaptionExtension,
    caseTitle,
    contactPrimary,
    noticeIssuedDate,
    taxYear,
  });
};

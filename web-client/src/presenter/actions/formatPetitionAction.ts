import { CASE_TYPES_MAP } from '@shared/business/entities/EntityConstants';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { state } from '@web-client/presenter/app.cerebral';

export const formatPetitionAction = ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  const petitionInfo = {
    ...props.createPetitionStep1Data,
    ...props.createPetitionStep2Data,
    ...props.createPetitionStep3Data,
    ...props.createPetitionStep4Data,
    ...props.step5Data,
  };

  const caseCaption =
    applicationContext
      .getUtilities()
      .getCaseCaption({ ...petitionInfo, petitioners: [] }) || '';

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta({
    caseCaption,
  });

  petitionInfo.originalCaseType = petitionInfo.caseType;
  petitionInfo.caseType = formatCaseType(petitionInfo.caseType);

  const { contactPrimary, irsNotices } = petitionInfo;

  const user = applicationContext.getCurrentUser();
  contactPrimary.email = user.email;

  let noticeIssuedDate;
  let taxYear;

  if (irsNotices[0]) {
    ({ noticeIssuedDate, taxYear } = irsNotices[0]);
  }

  const irsNoticesWithCaseTypes = irsNotices.map(irsNotice => {
    return {
      ...irsNotice,
      caseType: formatCaseType(irsNotice.caseType),
      originalCaseType: irsNotice.caseType,
    };
  });

  store.set(state.petitionFormatted, {
    ...petitionInfo,
    caseCaption,
    caseCaptionExtension,
    caseTitle,
    contactPrimary,
    irsNotices: irsNoticesWithCaseTypes,
    noticeIssuedDate,
    taxYear,
  });
};

function formatCaseType(caseType: string) {
  if (caseType === 'Disclosure1' || caseType === 'Disclosure2') {
    return CASE_TYPES_MAP.disclosure;
  }
  return caseType;
}

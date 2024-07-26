import {
  CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE,
  CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE,
} from '@shared/business/entities/EntityConstants';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { state } from '@web-client/presenter/app.cerebral';

export const formatPetitionAction = ({
  applicationContext,
  get,
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

  const caseDescription = petitionInfo.hasIrsNotice
    ? CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE[petitionInfo.caseType]
    : CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE[petitionInfo.caseType];

  const { CASE_TYPES_MAP } = applicationContext.getConstants();
  const disclosureCaseTypes = ['Disclosure1', 'Disclosure2'];

  if (disclosureCaseTypes.includes(petitionInfo.caseType)) {
    petitionInfo.caseType = CASE_TYPES_MAP.disclosure;
  }

  const { contactPrimary, irsNotices } = petitionInfo;

  const user = get(state.user);
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
    caseDescription,
    caseTitle,
    contactPrimary,
    noticeIssuedDate,
    taxYear,
  });
};

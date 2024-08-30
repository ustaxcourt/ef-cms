import {
  CASE_TYPES_MAP,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { NonJudgeContact, RawUser } from '@shared/business/entities/User';
import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { state } from '@web-client/presenter/app.cerebral';

export const formatPetitionAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const petitionInfo = {
    ...props.createPetitionStep1Data,
    ...props.createPetitionStep2Data,
    ...props.createPetitionStep3Data,
    ...props.createPetitionStep4Data,
    ...props.createPetitionStep5Data,
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

  const user = get(state.user);
  contactPrimary.email = user.email;

  const irsNoticesWithCaseTypes = irsNotices.map(irsNotice => {
    return {
      ...irsNotice,
      caseType: formatCaseType(irsNotice.caseType),
      originalCaseType: irsNotice.caseType,
    };
  });

  const contactCounsel = isRawPractitioner(user)
    ? {
        address1: (user.contact as NonJudgeContact)?.address1,
        address2: (user.contact as NonJudgeContact)?.address2,
        address3: (user.contact as NonJudgeContact)?.address3,
        barNumber: user.barNumber,
        city: (user.contact as NonJudgeContact)?.city,
        email: user.email,
        firmName: user.firmName,
        name: user.name,
        phone: user.contact?.phone,
        postalCode: (user.contact as NonJudgeContact)?.postalCode,
        state: (user.contact as NonJudgeContact)?.state,
      }
    : undefined;

  store.set(state.petitionFormatted, {
    ...petitionInfo,
    caseCaption,
    caseCaptionExtension,
    caseTitle,
    contactCounsel,
    contactPrimary,
    irsNotices: irsNoticesWithCaseTypes,
  });
};

function formatCaseType(caseType: string) {
  if (caseType === 'Disclosure1' || caseType === 'Disclosure2') {
    return CASE_TYPES_MAP.disclosure;
  }
  return caseType;
}

function isRawPractitioner(
  user: RawUser | RawPractitioner | RawIrsPractitioner,
): user is RawPractitioner {
  return user.role === ROLES.privatePractitioner;
}

import {
  MOTION_TO_WITHDRAW_AS_COUNSEL_DOCUMENT_TYPE,
  MOTION_TO_WITHDRAW_AS_COUNSEL_EVENT_CODE,
  NOTICE_OF_WITHDRAWAL_DOCUMENT_TYPE,
  NOTICE_OF_WITHDRAWAL_EVENT_CODE,
  ROLES,
} from '../EntityConstants';

/**
 * Whether a docket entry should display the filing practitioner's name as
 * its Filed By, rather than the parties the practitioner represents. This
 * applies to e-filed NOTWs and M112s, Nonstandard H filings targeting an
 * M112, and documents filed in support of either.
 */
export const isFiledByPractitionerName = ({
  docketEntry,
  user,
}: {
  docketEntry: {
    eventCode?: string;
    previousDocument?: { documentType?: string };
    secondaryDocument?: { eventCode?: string };
  };
  user?: { role?: string };
}): boolean => {
  const isNOTWRelated =
    docketEntry.eventCode === NOTICE_OF_WITHDRAWAL_EVENT_CODE ||
    docketEntry.previousDocument?.documentType ===
      NOTICE_OF_WITHDRAWAL_DOCUMENT_TYPE;
  const isM112Related =
    docketEntry.eventCode === MOTION_TO_WITHDRAW_AS_COUNSEL_EVENT_CODE ||
    docketEntry.secondaryDocument?.eventCode ===
      MOTION_TO_WITHDRAW_AS_COUNSEL_EVENT_CODE ||
    docketEntry.previousDocument?.documentType ===
      MOTION_TO_WITHDRAW_AS_COUNSEL_DOCUMENT_TYPE;
  const isPractitioner =
    user?.role === ROLES.irsPractitioner ||
    user?.role === ROLES.privatePractitioner;
  return (isNOTWRelated || isM112Related) && isPractitioner;
};

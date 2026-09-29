import { ROLES } from '../EntityConstants';

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
    docketEntry.eventCode === 'NOTW' ||
    docketEntry.previousDocument?.documentType ===
      'Notice of Withdrawal as Counsel';
  const isM112Related =
    docketEntry.eventCode === 'M112' ||
    docketEntry.secondaryDocument?.eventCode === 'M112' ||
    docketEntry.previousDocument?.documentType ===
      'Motion to Withdraw as Counsel';
  const isPractitioner =
    user?.role === ROLES.irsPractitioner ||
    user?.role === ROLES.privatePractitioner;
  return (isNOTWRelated || isM112Related) && isPractitioner;
};

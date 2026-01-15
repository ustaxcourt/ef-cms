import { state } from '@web-client/presenter/app.cerebral';
import {
  CASE_STATUS_TYPES,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import {
  calculateDifferenceInDays,
  createISODateString,
} from '@shared/business/utilities/DateHandler';

export const validateNoticeOfWithdrawalAction = ({ get, path }) => {
  const documentMetadata = get(state.form);
  const user = get(state.user);
  const caseDetail = get(state.caseDetail);

  const errors: string[] = [];
  if (documentMetadata.eventCode === 'NOTW') {
    if (user.role === ROLES.privatePractitioner) {
      const partiesToWithdrawFrom = getPartiesToWithrawFrom(caseDetail, user);
      if (partiesToWithdrawFrom.length === 0) {
        errors.push(
          'You are the only counsel representing a party on this case.',
        );
      }
    } else if (user.role === ROLES.irsPractitioner) {
      const irsPractitionerCount = caseDetail.irsPractitioners?.length || 0;
      if (irsPractitionerCount <= 1) {
        errors.push(
          'You are the only counsel representing a party on this case.',
        );
      }
    }
    if (
      caseDetail.status === CASE_STATUS_TYPES.calendared &&
      calculateDifferenceInDays(caseDetail.trialDate, createISODateString()) <
        30
    ) {
      errors.push('The case is scheduled for trial in less than 30 days.');
    }
  }

  if (errors.length === 0) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        message:
          'You must file a Motion to Withdraw as Counsel because of the following:',
        title: 'Cannot file Notice of Withdrawal as Counsel',
        messages: errors,
      },
    });
  }
};

export const getPartiesToWithrawFrom = (
  caseDetail: RawCase,
  user,
): string[] => {
  if (user.role === ROLES.privatePractitioner) {
    const representedPetitioner =
      caseDetail.privatePractitioners?.find(
        privatePractitioner => privatePractitioner.userId === user.userId,
      )?.representing || [];

    const partiesFiltered = representedPetitioner.filter(petitionerId => {
      for (const practitioner of caseDetail.privatePractitioners || []) {
        if (
          practitioner.userId !== user.userId &&
          practitioner.representing.includes(petitionerId)
        ) {
          return true;
        }
      }
      return false;
    });
    return partiesFiltered;
  }
  return [];
};

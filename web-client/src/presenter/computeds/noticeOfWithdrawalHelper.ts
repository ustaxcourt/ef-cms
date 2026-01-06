import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

import { getPartiesToWithrawFrom } from '../actions/validateNoticeOfWithdrawalAction';
import {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';

export const noticeOfWithdrawalHelper = (
  get: Get,
): {
  filingParties: TPetitioner[];
  partiesWithPaperService: TPetitioner[];
  showConsolidatedCaseAlertWarning: boolean;
  showEditContactInformation: boolean;
  showRespondant: boolean;
} => {
  const caseDetail = get(state.caseDetail);
  const user = get(state.user);

  const filingParties: TPetitioner[] = getPartiesToWithrawFrom(
    caseDetail,
    user,
  ).map(partyId =>
    caseDetail.petitioners.find(p => p.contactId === partyId),
  ) as TPetitioner[];

  const showRespondant = user.role === ROLES.irsPractitioner;

  const showEditContactInformation = filingParties.some(
    p => !p.isAddressSealed,
  );

  const partiesWithPaperService = caseDetail.petitioners.filter(
    p => p.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER,
  );

  const showConsolidatedCaseAlertWarning =
    caseDetail.consolidatedCases?.length > 0;

  return {
    filingParties,
    partiesWithPaperService,
    showConsolidatedCaseAlertWarning,
    showEditContactInformation,
    showRespondant,
  };
};

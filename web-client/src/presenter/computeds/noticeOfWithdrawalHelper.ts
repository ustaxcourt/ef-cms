// import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

import { getPartiesToWithrawFrom } from '../actions/validateNoticeOfWithdrawalAction';
import { SERVICE_INDICATOR_TYPES } from '@shared/business/entities/EntityConstants';

export const noticeOfWithdrawalHelper = (get: Get) => {
  const caseDetail = get(state.caseDetail);
  const partiesToWithdrawFrom = getPartiesToWithrawFrom(caseDetail).map(
    party => {
      const petitioner = caseDetail.petitioners.find(
        p => p.contactId === party,
      );
      return petitioner;
    },
  );

  const showEditContactInformation =
    partiesToWithdrawFrom.filter(p => p.isAddressSealed === false).length > 0;

  const partiesWithPaperService = caseDetail.petitioners.filter(
    p => p.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER,
  );

  return {
    partiesToWithdrawFrom,
    partiesWithPaperService,
    showEditContactInformation,
  };
};

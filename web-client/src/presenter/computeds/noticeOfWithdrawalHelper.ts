// import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

import { getPartiesToWithrawFrom } from '../actions/validateNoticeOfWithdrawalAction';

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

  return {
    partiesToWithdrawFrom,
  };
};

import { state } from '../app.cerebral';
import { getPartiesToWithrawFrom } from './validateNoticeOfWithdrawalAction';

export const setDefaultPaperServiceAcknowledgementAction = ({
  get,
  store,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const partiesToWithrawFrom = getPartiesToWithrawFrom(caseDetail);
  const hasPartyWithPaperService = partiesToWithrawFrom.some(partyContactId => {
    const petitioner = caseDetail.petitioners.find(
      petitioner => petitioner.contactId === partyContactId,
    );
    return petitioner?.serviceIndicator === 'Paper';
  });
  if (hasPartyWithPaperService) {
    store.set(state.form.paperServiceAcknowledgement, false);
  } else {
    store.unset(state.form.paperServiceAcknowledgement);
  }
};

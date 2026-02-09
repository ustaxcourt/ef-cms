import { state } from '../app.cerebral';

export const setDefaultPaperServiceAcknowledgementAction = ({
  get,
  store,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const hasPartyWithPaperService = caseDetail.petitioners.some(petitioner => {
    return petitioner.serviceIndicator === 'Paper';
  });
  if (hasPartyWithPaperService) {
    store.set(state.form.paperServiceAcknowledgement, false);
  } else {
    store.unset(state.form.paperServiceAcknowledgement);
  }
};

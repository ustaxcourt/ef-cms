import { state } from '@web-client/presenter/app.cerebral';

export const clearStatusReportOrderResponseFormAction = ({
  store,
}: ActionProps) => {
  store.unset(state.form.issueOrder);
  store.unset(state.form.statusReportOrStipulatedDecision);
  store.unset(state.form.dueDate);
  store.unset(state.form.strikenFromTrialSessions);
  store.unset(state.form.jurisdiction);
  store.set(state.form.additionalOrderText, '');
  store.set(state.form.docketEntryDescription, '');
};

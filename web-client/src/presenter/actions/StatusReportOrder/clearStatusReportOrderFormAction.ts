import { STATUS_REPORT_ORDER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const clearStatusReportOrderFormAction = ({ store }: ActionProps) => {
  store.unset(state.form.orderType);
  store.unset(state.form.dueDate);
  store.unset(state.form.strickenFromTrialSessions);
  store.unset(state.form.jurisdiction);
  store.set(state.form.additionalOrderText, '');
  store.set(state.form.docketEntryDescription, 'Order');
  store.set(
    state.form.issueOrder,
    STATUS_REPORT_ORDER_OPTIONS.issueOrderOptions.allCasesInGroup,
  );
};

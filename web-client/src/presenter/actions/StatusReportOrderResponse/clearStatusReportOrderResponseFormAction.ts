import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const clearStatusReportOrderResponseFormAction = ({
  get,
  store,
}: ActionProps) => {
  const documentToEdit = get(state.documentToEdit);
  if (isEmpty(documentToEdit)) {
    store.unset(state.form.orderType);
    store.unset(state.form.dueDate);
    store.unset(state.form.strickenFromTrialSessions);
    store.unset(state.form.jurisdiction);
    store.set(state.form.additionalOrderText, '');
    store.set(state.form.docketEntryDescription, 'Order');
    store.set(state.form.issueOrder, 'allCasesInGroup');
  }
};

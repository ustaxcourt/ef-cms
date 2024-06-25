import { state } from 'cerebral';

export const prepareStatusReportOrderResponseAction = ({
  store,
}: ActionProps) => {
  // TODO, maybe add documentType=Order ?
  store.set(state.form.documentTitle, 'Order');
  store.set(state.form.eventCode, 'O');
  // TODO, setup actual text here..
  store.set(
    state.form.richText,
    'On [FILED DATE OF SR], a status report was filed in this case (Index no. [INDEX_NUMBER_OF_STATUS_REPORT]). For cause, it is',
  );
};

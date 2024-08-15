import { StatusReportOrderForm as StatusReportOrderForm } from '@shared/business/entities/StatusReportOrderForm';
import { state } from '@web-client/presenter/app.cerebral';

export const validateStatusReportOrderFormAction = ({
  get,
  path,
}: ActionProps) => {
  const {
    additionalOrderText,
    docketEntryDescription,
    dueDate,
    issueOrder,
    jurisdiction,
    orderType,
    strickenFromTrialSessions,
  } = get(state.form);

  const errors = new StatusReportOrderForm({
    additionalOrderText,
    docketEntryDescription,
    dueDate,
    issueOrder,
    jurisdiction,
    orderType,
    strickenFromTrialSessions,
  }).getFormattedValidationErrors();

  if (!errors) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors,
    });
  }
};

import { StatusReportOrderResponseForm } from '@shared/business/entities/StatusReportOrderResponseForm';
import { state } from '@web-client/presenter/app.cerebral';

export const validateStatusReportOrderResponseFormAction = ({
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
    strikenFromTrialSessions,
  } = get(state.form);

  const errors = new StatusReportOrderResponseForm({
    additionalOrderText,
    docketEntryDescription,
    dueDate,
    issueOrder,
    jurisdiction,
    orderType,
    strikenFromTrialSessions,
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

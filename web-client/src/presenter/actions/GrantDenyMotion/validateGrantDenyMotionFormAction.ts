import { GrantDenyMotionForm } from '@shared/business/entities/GrantDenyMotionForm';
import { isLeadCase } from '@shared/business/entities/cases/Case';
import { state } from '@web-client/presenter/app.cerebral';

export const validateGrantDenyMotionFormAction = ({
  get,
  path,
}: ActionProps) => {
  const form = get(state.form);
  const caseDetail = get(state.caseDetail);

  const errors = new GrantDenyMotionForm({
    ...form,
    isOnLeadCase: isLeadCase(caseDetail),
  }).getFormattedValidationErrors();

  if (!errors) {
    return path.success();
  }

  return path.error({
    alertError: {
      title: 'Errors were found. Please correct your form and resubmit.',
    },
    errors,
  });
};

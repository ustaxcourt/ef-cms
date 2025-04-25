import { MotionOrderResponseForm } from '@shared/business/entities/MotionOrderResponseForm';
import { state } from '@web-client/presenter/app.cerebral';

export const validateMotionOrderResponseFormAction = ({
  get,
  path,
}: ActionProps) => {
  const errors = new MotionOrderResponseForm(
    get(state.form),
  ).getFormattedValidationErrors();

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

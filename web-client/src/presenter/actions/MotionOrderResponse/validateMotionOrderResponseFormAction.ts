import { MotionOrderResponseForm } from '@shared/business/entities/MotionOrderResponseForm';
import { state } from '@web-client/presenter/app.cerebral';

export const validateMotionOrderResponseFormAction = ({
  get,
  path,
}: ActionProps) => {
  const { additionalOrderText, dueDate, motionOrderResponse, responseDate } = get(
    state.form,
  );

  const errors = new MotionOrderResponseForm({
    additionalOrderText,
    dueDate,
    motionOrderResponse,
    responseDate,
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

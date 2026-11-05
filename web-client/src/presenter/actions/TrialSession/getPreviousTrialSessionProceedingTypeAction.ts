import { TrialSessionProceedingType } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const getPreviousTrialSessionProceedingTypeAction = ({
  get,
}: ActionProps): { previousProceedingType?: TrialSessionProceedingType } => {
  return { previousProceedingType: get(state.form.proceedingType) };
};

import { state } from '@web-client/presenter/app.cerebral';

export const shouldValidateAction = ({ get, path }: ActionProps) => {
  if (get(state.showValidation)) return path.validate();
  return path.ignore();
};

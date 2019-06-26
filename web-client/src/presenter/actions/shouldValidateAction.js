import { state } from 'cerebral';

export const shouldValidateAction = ({ get, path }) => {
  if (get(state.showValidation)) return path.validate();
  return path.ignore();
};

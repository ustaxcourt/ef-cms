import { state } from 'cerebral';

export const shouldValidateAction = ({ path, get }) => {
  if (get(state.showValidation)) return path.validate();
  return path.ignore();
};

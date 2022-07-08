import { state } from 'cerebral';

export const shouldValidateAction = ({ get, path }) => {
  console.log('get(state.showValidation)', get(state.showValidation));
  if (get(state.showValidation)) return path.validate();
  return path.ignore();
};

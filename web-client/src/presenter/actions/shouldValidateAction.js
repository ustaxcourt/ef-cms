import { state } from 'cerebral';

export const shouldValidateAction = ({ get, path }) => {
  if (get(state.showValidation)) {
    console.log('in shouldValidateAction valid');
    return path.validate();
  }
  console.log('in shouldValidateAction ignore');
  return path.ignore();
};

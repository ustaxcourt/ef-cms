import { state } from 'cerebral';

export default ({ path, get }) => {
  if (get(state.showValidation)) return path.validate();
  return path.ignore();
};

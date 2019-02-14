import { state } from 'cerebral';

export default ({ path }) => {
  if (state.showValidation) return path.validate();
};

import { state } from 'cerebral';

/**
 * change path based on if editing an order or creating a new one
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path used for setting state.submitting
 * @returns the path to take, either yes or no
 */
export const isEditingOrderAction = ({ get, path }) => {
  const documentToEdit = get(state.documentToEdit);
  if (documentToEdit) {
    return path.yes();
  } else {
    return path.no();
  }
};

import { state } from '@web-client/presenter/app.cerebral';

/**
 * change path based on if editing an order or creating a new one
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path to take depending on if documentToEdit was set or not
 * @param {object} providers.get the cerebral get method used for getting state
 * @returns {object} path to take, either yes or no
 */
export const isEditingOrderAction = ({ get, path }: ActionProps) => {
  const documentToEdit = get(state.documentToEdit);
  if (documentToEdit) {
    return path.yes();
  } else {
    return path.no();
  }
};

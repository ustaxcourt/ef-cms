import { state } from '@web-client/presenter/app.cerebral';

/**
 * checks if we are editing a docket entry or creating a new one
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const isEditingDocketEntryAction = ({ get, path }: ActionProps) => {
  return get(state.isEditingDocketEntry) ? path.yes() : path.no();
};

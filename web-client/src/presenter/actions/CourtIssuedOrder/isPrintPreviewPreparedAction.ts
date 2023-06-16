import { state } from '@web-client/presenter/app.cerebral';

/**
 * checks if we need to send user to a pdf preview
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const isPrintPreviewPreparedAction = ({ get, path }: ActionProps) => {
  return get(state.pdfPreviewUrl) ? path.yes() : path.no();
};

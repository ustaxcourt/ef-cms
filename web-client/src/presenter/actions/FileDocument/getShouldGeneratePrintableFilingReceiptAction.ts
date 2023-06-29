import { state } from '@web-client/presenter/app.cerebral';

/**
 * Determines if a printable filing receipt should be generated
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of true or false)
 * @param {object} providers.props the cerebral props object
 * @returns {object} the next path based on if a receipt should be generated
 */

export const getShouldGeneratePrintableFilingReceiptAction = ({
  get,
  path,
  props,
}: ActionProps) => {
  if (!get(state.documentToEdit) && props.documentsFiled) {
    return path.true();
  }

  return path.false();
};

/**
 * invokes the path in the sequences depending on if the user has selected an order type
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get method for getting the state.user
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @returns {object} the path to execute
 */
export const hasOrderTypeSelectedAction = ({ path, props }: ActionProps) => {
  const { docketNumber, eventCode } = props;
  if (eventCode) {
    return path['proceed']();
  } else {
    return path['no']({ docketNumber });
  }
};

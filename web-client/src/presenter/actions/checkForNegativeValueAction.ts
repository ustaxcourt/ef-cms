/**
 * Checks to see if passed in value starts with a '-'
 * @param {object} providers the providers object
 * @param {object} providers.path the next object in the path
 * @param {object} providers.props the cerebral props object
 * @returns {Promise<*>} the set or unset path
 */

export const checkForNegativeValueAction = ({ path, props }: ActionProps) => {
  const { value } = props;

  if (value.charAt(0) === '-' && value.charAt(1)) {
    return path.set();
  }

  return path.unset();
};

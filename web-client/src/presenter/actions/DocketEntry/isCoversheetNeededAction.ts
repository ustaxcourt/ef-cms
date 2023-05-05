/**
 * Determines if a coversheet needs to be generated
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the next object in the path
 * @param {object} providers.props the cerebral props object
 * @returns {*} returns the next action in the sequence's path
 */
export const isCoversheetNeededAction = ({ path, props }: ActionProps) => {
  const { generateCoversheet } = props;

  if (generateCoversheet) {
    return path.yes();
  }

  return path.no();
};

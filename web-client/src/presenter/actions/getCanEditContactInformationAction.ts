/**
 * Determines if a user's contact information is already being updated
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @returns {object} continue path for the sequence
 */
export const getCanEditContactInformationAction = ({
  path,
  props,
}: ActionProps) => {
  const { user } = props;

  if (user.isUpdatingInformation) {
    return path.no({
      alertError: {
        message: 'Update already in progress. Please try again later.',
        title: 'Update Error',
      },
    });
  }

  return path.yes();
};

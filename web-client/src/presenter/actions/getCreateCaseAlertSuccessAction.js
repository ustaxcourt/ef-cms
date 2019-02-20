/**
 * creates the default success alert object
 *
 * @returns {Object} the alertSuccess object with default strings
 */
export default () => {
  return {
    alertSuccess: {
      title: 'Your petition has been successfully submitted.',
      message: 'You can access your case at any time from the case list below.',
    },
  };
};

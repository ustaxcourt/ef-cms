/**
 * creates the default success alert object
 *
 * @param {object} provider the provider object
 * @param {object} provider.props the props object
 * @returns {object} the alertSuccess object with default strings
 */
export const getCreateCaseAlertSuccessAction = ({ props }) => {
  const { docketNumber } = props.caseDetail;
  return {
    alertSuccess: {
      linkText: 'Print receipt.',
      linkUrl: `/case-detail/${docketNumber}/confirmation`,
      message: 'You can access your case at any time from the case list below.',
      title: 'Your petition has been successfully submitted.',
    },
  };
};

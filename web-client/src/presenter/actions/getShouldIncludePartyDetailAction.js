/**
 * determines if the user should see party detail when generating a printable docket record
 *
 * @param {object} providers the providers object
 * @param {Function} providers.applicationContext the applicationContext
 * @param {Function} providers.props the cerebral props object
 * @returns {object} the props containing shouldIncludePartyDetail
 */
export const getShouldIncludePartyDetailAction = async ({
  applicationContext,
  props,
}) => {
  const { isAssociated } = props;
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();

  const shouldIncludePartyDetail =
    user.role !== USER_ROLES.irsPractitioner || isAssociated;

  return { shouldIncludePartyDetail };
};

/**
 * changes the path based on if the report is global
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for accessing local storage
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or failure)
 * @returns {object} the path the user should take
 */
export const isGlobalReportAction = async ({ path, props }) => {
  const { caseIdFilter } = props;

  if (caseIdFilter) {
    return path.no();
  } else {
    return path.yes();
  }
};

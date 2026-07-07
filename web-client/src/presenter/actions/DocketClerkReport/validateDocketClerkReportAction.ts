import { state } from '@web-client/presenter/app.cerebral';

/**
 * validates that a docket clerk and a page type have both been selected before
 * running the docket clerk report
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path function
 * @param {object} providers.store the cerebral store
 * @returns {object} the path to take (success or error)
 */
export const validateDocketClerkReportAction = ({
  get,
  path,
  store,
}: ActionProps) => {
  const form = get(state.docketClerkReport.form);

  const errors: { docketClerkUserId?: string; pageType?: string } = {};

  if (!form.docketClerkUserId) {
    errors.docketClerkUserId = 'Select a Docket Clerk';
  }

  if (!form.pageType) {
    errors.pageType = 'Select a Page Type';
  }

  if (errors.docketClerkUserId || errors.pageType) {
    store.set(state.docketClerkReport.errors, errors);
    return path.error();
  }

  store.set(state.docketClerkReport.errors, null);
  return path.success();
};

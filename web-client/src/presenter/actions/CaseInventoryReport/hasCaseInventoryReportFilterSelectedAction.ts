import { state } from '@web-client/presenter/app.cerebral';

/**
 * invokes the path in the sequences depending on if the user has selected a case inventory report filter
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get method
 * @param {object} providers.path the cerebral path which contains the next paths that can be invoked
 * @returns {object} the path to execute
 */
export const hasCaseInventoryReportFilterSelectedAction = ({
  get,
  path,
}: ActionProps) => {
  const { associatedJudge, status } = get(state.screenMetadata);
  if (associatedJudge || status) {
    return path['proceed']();
  } else {
    return path['no']();
  }
};

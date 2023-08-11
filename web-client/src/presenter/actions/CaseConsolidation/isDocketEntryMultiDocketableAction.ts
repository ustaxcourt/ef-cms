import { state } from '@web-client/presenter/app.cerebral';

// eslint-disable-next-line spellcheck/spell-checker
/**
 * Determines if the docket entry event code is one that can be multi-docketed
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext object
 * @param {object} providers.get the cerebral get object
 * @param {object} providers.path the cerebral path object
 * @returns {object} the next path based on if docket entry is multi-docketable
 */
export const isDocketEntryMultiDocketableAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { NON_MULTI_DOCKETABLE_EVENT_CODES } =
    applicationContext.getConstants();

  const currentPage = get(state.currentPage);
  const caseDetail = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);

  let { eventCode } = get(state.form);

  if (!eventCode) {
    ({ eventCode } = caseDetail.docketEntries.find(
      doc => doc.docketEntryId === docketEntryId,
    ));
  }

  if (
    NON_MULTI_DOCKETABLE_EVENT_CODES.includes(eventCode) ||
    currentPage === 'MessageDetail'
  ) {
    return path.no();
  }

  return path.yes();
};

import { state } from '@web-client/presenter/app.cerebral';

/**
 * update state form with docket record entry and document properties
 * @param {object} providers the providers object
 * @param {object} providers.props the props passed to this action
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 * @returns {void}
 */
export const setDocketEntryMetaFormForEditAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { docketEntries } = get(state.caseDetail);
  const { docketRecordIndex } = props;

  const documentDetail = docketEntries.find(
    ({ index }) => index === docketRecordIndex,
  );

  if (!documentDetail) {
    throw new Error(
      `Could not find docket entry with index ${docketRecordIndex}`,
    );
  }

  const filersMap = {};
  documentDetail.filers.forEach(filer => (filersMap[filer] = true));

  store.set(state.form, {
    ...documentDetail,
    filersMap,
    lodged: !!documentDetail.lodged,
  });

  return {
    key: 'initEventCode',
    value: documentDetail.eventCode,
  };
};

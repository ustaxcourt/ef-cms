import { state } from '@web-client/presenter/app.cerebral';

/**
 * update state form with docket record entry and document properties
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the props passed to this action
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 * @returns {void}
 */
export const setDocketEntryMetaFormForEditAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const { docketEntries } = get(state.caseDetail);
  const { docketRecordIndex } = props;

  const documentDetail = docketEntries.find(
    ({ index }) => index === docketRecordIndex,
  );

  store.set(state.docketRecordIndex, docketRecordIndex);

  documentDetail.filersMap = {};
  documentDetail.filers.forEach(
    filer => (documentDetail.filersMap[filer] = true),
  );

  documentDetail.servedPartiesCode =
    documentDetail.servedPartiesCode ||
    applicationContext
      .getUtilities()
      .getServedPartiesCode(documentDetail.servedParties);

  store.set(state.form, {
    ...documentDetail,
    lodged: !!documentDetail.lodged,
  });

  return {
    key: 'initEventCode',
    value: documentDetail.eventCode,
  };
};

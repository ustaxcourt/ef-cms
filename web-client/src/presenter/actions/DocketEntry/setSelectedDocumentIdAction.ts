import { DownloadDocketEntryRequestType } from '@shared/business/useCases/document/batchDownloadDocketEntriesInteractor';
import { isEqual } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const setSelectedDocumentIdAction = ({
  get,
  props,
  store,
}: ActionProps<DownloadDocketEntryRequestType>) => {
  // console.log('props', props);
  const { docketEntries } = props;
  let documentsSelectedForDownload = get(state.documentsSelectedForDownload);
  // console.log(
  //   'documentsSelectedForDownload in action',
  //   documentsSelectedForDownload,
  // );

  // todo: Is there a better way to represent multi-selection that checking the length of the array?
  if (docketEntries.length > 1) {
    if (isEqual(docketEntries, documentsSelectedForDownload)) {
      store.set(state.documentsSelectedForDownload, []);
    } else {
      store.set(state.documentsSelectedForDownload, docketEntries);
    }
  } else if (docketEntries.length === 1) {
    const document = docketEntries[0];
    const index = documentsSelectedForDownload.findIndex(
      doc => doc.docketEntryId === document.docketEntryId,
    );

    if (index !== -1) {
      documentsSelectedForDownload.splice(index, 1);
    } else {
      documentsSelectedForDownload.push(document);
    }

    store.set(state.documentsSelectedForDownload, documentsSelectedForDownload);
  }
};

import { state } from '@web-client/presenter/app.cerebral';

export const setAddEditDocketEntryWorksheetModalStateAction = ({
  get,
  props,
  store,
}: ActionProps<{
  docketEntryId: string;
}>) => {
  const { docketEntryId } = props;

  const { docketEntries } = get(state.pendingMotions);
  const docketEntry = docketEntries.find(
    deWs => deWs.docketEntryId === docketEntryId,
  );

  console.log('docketEntryWorksheet', docketEntry);

  store.set(state.form, {
    ...docketEntry?.docketEntryWorksheet,
    docketNumber: docketEntry?.docketNumber,
  });
};

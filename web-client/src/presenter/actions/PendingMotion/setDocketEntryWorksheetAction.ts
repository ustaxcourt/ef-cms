import { RawDocketEntryWorksheet } from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import { state } from '@web-client/presenter/app.cerebral';

export const setDocketEntryWorksheetAction = ({
  get,
  props,
  store,
}: ActionProps<{ updatedWorksheet: RawDocketEntryWorksheet }>) => {
  const { updatedWorksheet } = props;

  const { docketEntries } = get(state.pendingMotions);

  const docketEntryIndex = docketEntries.findIndex(
    deWs => deWs.docketEntryId === updatedWorksheet.docketEntryId,
  );

  store.set(
    state.pendingMotions.docketEntries[docketEntryIndex].docketEntryWorksheet,
    updatedWorksheet,
  );
};

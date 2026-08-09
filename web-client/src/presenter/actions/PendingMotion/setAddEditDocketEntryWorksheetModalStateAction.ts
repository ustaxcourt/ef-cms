import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
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

  const worksheet = docketEntry?.docketEntryWorksheet;

  store.set(state.form, {
    ...worksheet,
    docketNumber: docketEntry?.docketNumber,
    ...(worksheet?.finalBriefDueDate && {
      finalBriefDueDate: formatDateString(
        worksheet.finalBriefDueDate,
        FORMATS.YYYYMMDD,
      ),
    }),
  });
};

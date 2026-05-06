import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { state } from '@web-client/presenter/app.cerebral';

export const checkMultiDocketedOriginalCaseAction = ({
  get,
  props,
}: ActionProps) => {
  const { docketEntries } = get(state.caseDetail);
  const { docketRecordIndex, docketEntryId } = props;

  const documentDetail = docketEntries.find(
    de => de.index === docketRecordIndex || de.docketEntryId === docketEntryId,
  );

  if (!documentDetail) {
    throw new Error(
      `Could not find docket entry with index ${docketRecordIndex}`,
    );
  }

  if (
    DocketEntry.isMultiDocketed(documentDetail) &&
    documentDetail.docketNumber !== documentDetail.originallyFiledDocketNumber
  ) {
    return {
      originallyFiledDocketNumber: documentDetail.originallyFiledDocketNumber,
    };
  }
};

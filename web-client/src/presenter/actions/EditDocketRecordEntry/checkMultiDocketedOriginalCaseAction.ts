import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { state } from '@web-client/presenter/app.cerebral';

export const checkMultiDocketedOriginalCaseAction = ({
  get,
  props,
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

  if (
    DocketEntry.isMultiDocketed(documentDetail) &&
    documentDetail.docketNumber !==
      documentDetail.multiDocketedOriginalDocketNumber
  ) {
    return {
      multiDocketedOriginalDocketNumber:
        documentDetail.multiDocketedOriginalDocketNumber,
    };
  }
};

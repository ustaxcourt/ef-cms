import { DocketEntryWorksheet } from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import { RawDocketEntryWorksheet } from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';

export const validateDocketEntryWorksheetInteractor = ({
  docketEntryWorksheet,
}: {
  docketEntryWorksheet: RawDocketEntryWorksheet;
}): Record<string, string> | null => {
  return new DocketEntryWorksheet(
    docketEntryWorksheet,
  ).getFormattedValidationErrors();
};

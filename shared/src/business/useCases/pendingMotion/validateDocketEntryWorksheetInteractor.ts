import { DocketEntryWorksheet } from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';

export const validateDocketEntryWorksheetInteractor = ({
  docketEntryWorksheet,
}): Record<string, string> | null => {
  return new DocketEntryWorksheet(
    docketEntryWorksheet,
  ).getFormattedValidationErrors();
};

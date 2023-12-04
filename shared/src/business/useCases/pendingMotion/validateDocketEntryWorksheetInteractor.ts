import { DocketEntryWorksheet } from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';

export const validateDocketEntryWorksheetInteractor = ({
  docketEntryWorksheet,
}): Record<string, string> | null => {
  const errors = new DocketEntryWorksheet(
    docketEntryWorksheet,
  ).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};

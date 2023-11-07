import { DocketEntryFactory } from '../../entities/docketEntry/DocketEntryFactory';

/**
 * validateDocketEntryInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.entryMetadata the docket entry metadata
 * @returns {object} errors (null if no errors)
 */
export const validateDocketEntryInteractor = ({
  entryMetadata,
}: {
  entryMetadata: any;
}) => {
  const docketEntry = new DocketEntryFactory(entryMetadata);
  return docketEntry.getFormattedValidationErrors();
};

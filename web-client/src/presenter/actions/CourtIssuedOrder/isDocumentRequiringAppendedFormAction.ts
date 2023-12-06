import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * Determines if the document being uploaded requires an appended form
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method used for getting state
 * @param {object} providers.path the cerebral path to take depending on if the file was uploaded successfully or not
 * @returns {object} the next path based on if the file was successfully uploaded or not
 */
export const isDocumentRequiringAppendedFormAction = ({
  get,
  path,
}: ActionProps) => {
  const { eventCode } = get(state.documentToEdit);

  if (
    eventCode ===
      SYSTEM_GENERATED_DOCUMENT_TYPES.orderForAmendedPetition.eventCode ||
    eventCode ===
      SYSTEM_GENERATED_DOCUMENT_TYPES.orderForAmendedPetitionAndFilingFee
        .eventCode
  ) {
    return path.yes();
  }

  return path.no();
};

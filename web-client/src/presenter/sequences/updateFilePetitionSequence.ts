import { clearPetitionRedactionAcknowledgementAction } from '@web-client/presenter/actions/clearPetitionRedactionAcknowledgementAction';
import { updateFormValueSequence } from '@web-client/presenter/sequences/updateFormValueSequence';

export const updateFilePetitionSequence = [
  updateFormValueSequence,
  clearPetitionRedactionAcknowledgementAction,
] as unknown as (props: { key: string; value: any; index?: number }) => void;

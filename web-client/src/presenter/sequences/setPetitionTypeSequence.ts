import { clearPetitionFormAction } from '@web-client/presenter/actions/clearPetitionFormAction';
import { setFormValueAction } from '@web-client/presenter/actions/setFormValueAction';

export const setPetitionTypeSequence = [
  clearPetitionFormAction,
  setFormValueAction,
] as unknown as (props: {
  allowEmptyString?: boolean;
  index?: number;
  key: string;
  value: any;
}) => void;

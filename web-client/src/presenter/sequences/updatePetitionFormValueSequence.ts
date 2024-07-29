import { setFormValueAction } from '@web-client/presenter/actions/setFormValueAction';

export const updatePetitionFormValueSequence = [
  setFormValueAction,
] as unknown as (props: { index: number; key: string; value: any }) => void;

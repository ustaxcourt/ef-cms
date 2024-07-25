import { setPetitionFormValueAction } from '@web-client/presenter/actions/setPetitionFormValueAction';

export const updatePetitionFormValueSequence = [
  setPetitionFormValueAction,
] as unknown as (props: { index: number; key: string; value: any }) => void;

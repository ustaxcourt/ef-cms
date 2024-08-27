import { setFormValueAction } from '../actions/setFormValueAction';

export const updateFormValueSequence = [
  setFormValueAction,
] as unknown as (props: {
  index: number;
  root?: string;
  key: string;
  value: any;
  allowEmptyString?: boolean;
}) => void;

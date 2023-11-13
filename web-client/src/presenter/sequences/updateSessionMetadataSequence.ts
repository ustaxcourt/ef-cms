import { setSessionMetadataValueAction } from '../actions/setSessionMetadataValueAction';

export const updateSessionMetadataSequence = [
  setSessionMetadataValueAction,
] as unknown as (props: { key: string; value: string }) => void;

import { resetSelectedMessageAction } from '@web-client/presenter/actions/Messages/resetSelectedMessageAction';
import { setScreenMetadataValueAction } from '../actions/setScreenMetadataValueAction';

export const updateMessageFilterSequence = [
  resetSelectedMessageAction,
  setScreenMetadataValueAction,
] as unknown as (props: {
  isSelected: boolean;
  key: string;
  label: string;
  options: string;
}) => void;

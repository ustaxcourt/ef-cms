import { openInvalidFilesModalAction } from '@web-client/presenter/actions/openInvalidFilesModalAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const openInvalidFilesModalSequence = showProgressSequenceDecorator([
  openInvalidFilesModalAction,
]);

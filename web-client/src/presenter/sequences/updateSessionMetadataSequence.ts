import { sequence } from 'cerebral';
import { setSessionMetadataValueAction } from '../actions/setSessionMetadataValueAction';

export const updateSessionMetadataSequence = sequence<{
  key: string;
  value: string;
}>([setSessionMetadataValueAction]);

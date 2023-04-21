import { retryAsyncRequestAction } from '../actions/retryAsyncRequestAction';
import { waitAction } from '../actions/waitAction';

export const retryAsyncRequestSequence = [waitAction, retryAsyncRequestAction];

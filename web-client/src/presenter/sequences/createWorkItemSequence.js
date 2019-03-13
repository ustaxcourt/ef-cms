import { createWorkItemAction } from '../actions/createWorkItemAction';
import { clearModalAction } from '../actions/clearModalAction';

export const createWorkItemSequence = [createWorkItemAction, clearModalAction];

import { persistPublicAppStateAction } from '../actions/persistPublicAppStateAction';
import { reloadPageAction } from '../actions/reloadPageAction';

export const persistFormsOnReloadSequence = [
  persistPublicAppStateAction,
  reloadPageAction,
];

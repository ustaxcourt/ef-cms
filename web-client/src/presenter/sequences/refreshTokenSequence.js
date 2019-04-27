import { refreshTokenAction } from '../actions/refreshTokenAction';
import { setTokenAction } from '../actions/setTokenAction';

export const refreshTokenSequence = [refreshTokenAction, setTokenAction];

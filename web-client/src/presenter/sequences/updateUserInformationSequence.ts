import { getUserAction } from '../actions/getUserAction';
import { setUserAction } from '@web-client/presenter/actions/setUserAction';

export const updateUserInformationSequence = [getUserAction, setUserAction];

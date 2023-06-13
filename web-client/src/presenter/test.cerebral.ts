import { ClientState } from './app.cerebral';
import {
  runAction as cerebralRunAction,
  runCompute as cerebralRunCompute,
} from 'cerebral/test';

type fakeRunComputeType = <T>(
  someFunction: (get: any) => T,
  fixtures: any,
) => T;
export const runCompute = cerebralRunCompute as unknown as fakeRunComputeType;

type fakeRunActionType = <T>(
  action: (actionProps: any) => Promise<T> | T,
  fixtures: any,
) => { state: ClientState; props: any; output: T };
export const runAction = cerebralRunAction as unknown as fakeRunActionType;

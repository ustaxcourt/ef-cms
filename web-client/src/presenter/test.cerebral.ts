import {
  runAction as cerebralRunAction,
  runCompute as cerebralRunCompute,
} from 'cerebral/test';
import type { ClientState } from '@web-client/presenter/state';

type FakeRunComputeType = <T>(
  compute: (get: any) => T,
  state: { state: any },
) => T;
export const runCompute = cerebralRunCompute as unknown as FakeRunComputeType;

type FakeRunActionType = <T>(
  action: (actionProps: any) => Promise<T> | T,
  fixtures: { modules?: { presenter: any }; props?: any; state?: any },
) => { state: ClientState; props: any; output: T };
export const runAction = cerebralRunAction as unknown as FakeRunActionType;

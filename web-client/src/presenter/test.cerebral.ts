import {
  runAction as cerebralRunAction,
  runCompute as cerebralRunCompute,
} from 'cerebral/test';
import type { ClientState } from '@web-client/presenter/state';
import type { PublicClientState } from '@web-client/presenter/state-public';

type FakeRunComputeType = <T>(
  compute: (get: any) => T,
  state: { state: any },
) => T;
export const runCompute = cerebralRunCompute as unknown as FakeRunComputeType;

type FakeRunActionType = <T>(
  action: (actionProps: any) => Promise<T> | T,
  fixtures: { modules?: { presenter: any }; props?: any; state?: any },
) => { state: ClientState; props: any; output: T };

type FakeRunPublicActionType = <T>(
  action: (actionProps: any) => Promise<T> | T,
  fixtures: { modules?: { presenter: any }; props?: any; state?: any },
) => { state: PublicClientState; props: any; output: T };

export const runAction = cerebralRunAction as unknown as FakeRunActionType;
export const runPublicAction =
  cerebralRunAction as unknown as FakeRunPublicActionType;

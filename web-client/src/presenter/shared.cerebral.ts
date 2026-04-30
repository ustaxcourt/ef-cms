import { connect as cerebralConnect } from '@cerebral/react';
import type { FunctionComponent, PropsWithChildren } from 'react';

type FakeConnectType = <PassedProps, Deps>(
  depsMap: Deps,
  component: FunctionComponent<PropsWithChildren<Deps & PassedProps>>,
) => FunctionComponent<PropsWithChildren<PassedProps & { [key: string]: any }>>;
export const connect = cerebralConnect as unknown as FakeConnectType;

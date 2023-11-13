import { connect as cerebralConnect } from '@cerebral/react';
import type { FunctionComponent } from 'react';

type FakeConnectType = <PassedProps, Deps>(
  depsMap: Deps,
  component: FunctionComponent<Deps & PassedProps>,
) => FunctionComponent<PassedProps>;
export const connect = cerebralConnect as unknown as FakeConnectType;

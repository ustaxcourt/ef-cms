import { connect as cerebralConnect } from '@cerebral/react';
import type { ClientApplicationContext } from '@web-client/applicationContext';
import type { FunctionComponent } from 'react';
import type { Get } from 'cerebral';

type FakeConnectType = <PassedProps, Deps>(
  depsMap: Deps,
  component: FunctionComponent<Deps & PassedProps>,
) => FunctionComponent<PassedProps>;
export const connect = cerebralConnect as unknown as FakeConnectType;

export function computed<Helper>(
  helper: (get: Get, applicationContext: ClientApplicationContext) => Helper,
): Helper {
  return helper as unknown as Helper;
}

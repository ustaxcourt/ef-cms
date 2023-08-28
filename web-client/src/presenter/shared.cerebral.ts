import { FunctionComponent } from 'react';
import { IReactComponent, connect as cerebralConnect } from '@cerebral/react';

type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

type FunctionsOnly<T> = {
  [K in FunctionKeys<T>]: T[K] extends (...args: any[]) => infer R ? R : never;
};

type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
}[keyof T];

type NonFunctionsOnly<T> = Pick<T, NonFunctionKeys<T>>;

export const connect = cerebralConnect as unknown as <Deps>(
  depsMap: Deps,
  component: FunctionComponent<FunctionsOnly<Deps> & NonFunctionsOnly<Deps>>,
) => IReactComponent;

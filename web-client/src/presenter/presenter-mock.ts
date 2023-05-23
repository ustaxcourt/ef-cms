import { ClientApplicationContext } from '../applicationContext';
import { baseState } from './state';

export const presenter = {
  providers: {
    applicationContext: {} as ClientApplicationContext,
  },
  sequences: {},
  state: baseState,
} as {
  providers: {
    applicationContext: ClientApplicationContext;
    path: any;
  };
  sequences: any;
  state: typeof baseState;
};

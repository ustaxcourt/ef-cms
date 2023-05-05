import { ClientApplicationContext } from '../applicationContext';
import { baseState } from './state';

export const presenter = {
  providers: {
    applicationContext: {} as ClientApplicationContext,
  },
  sequences: {},
  state: baseState,
};

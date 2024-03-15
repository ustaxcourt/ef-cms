import { cloneDeep } from 'lodash';

type CypressState = {
  docketNumber: string;
  currentUser: {
    email: string;
    name: string;
    pendingEmail?: string;
  };
};

const defaultState = {
  currentUser: {
    email: '',
    name: '',
  },
  docketNumber: '',
};

export let cypressState: CypressState = cloneDeep(defaultState);

export const cypressStateReset = () => {
  cypressState = cloneDeep(defaultState);
};

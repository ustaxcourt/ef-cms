type CypressState = {
  docketNumber: string;
};

const defaultState = {
  docketNumber: '',
};

export let cypressState: CypressState = defaultState;

export const cypressStateReset = () => {
  cypressState = defaultState;
};

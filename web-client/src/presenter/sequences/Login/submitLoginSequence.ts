import { state } from '@web-client/presenter/app-public.cerebral';

export const submitLoginSequence = [
  ({ get }) => {
    console.log('in submitLoginSequence');
    console.log(get(state.form));
  },
] as unknown as (props) => void;

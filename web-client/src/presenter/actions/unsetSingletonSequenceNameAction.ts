import { state } from '@web-client/presenter/app.cerebral';

export const unsetSingletonSequenceNameAction = ({
  props,
  store,
}: ActionProps<{ sequenceName: string }>) => {
  const { sequenceName } = props;
  store.unset(state.sequenceSingleton[sequenceName]);
};

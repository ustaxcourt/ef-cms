import { state } from '@web-client/presenter/app.cerebral';

export const setSingletonSequenceNameAction = ({
  get,
  path,
  props,
  store,
}: ActionProps<{ sequenceName: string }>) => {
  const { sequenceName } = props;
  if (get(state.sequenceSingleton[sequenceName])) return path.alreadyRunning();
  store.set(state.sequenceSingleton[sequenceName], true);
  return path.execute();
};

import { state } from '@web-client/presenter/app.cerebral';

export const removeFactOrReasonAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { index, key } = props;

  if (index > 0) {
    let factsOrReasons = get(state.form[key]);

    factsOrReasons.splice(index, 1);

    store.set(state.form[key], factsOrReasons);
  }
};

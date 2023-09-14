import { state } from '@web-client/presenter/app.cerebral';

export const setDefaultGenerationTypeAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { GENERATION_TYPES } = get(state.constants);

  if (props.key === 'eventCode') {
    if (props.value === 'EA') {
      store.set(state.form.generationType, GENERATION_TYPES.AUTO);
    } else {
      store.set(state.form.generationType, GENERATION_TYPES.MANUAL);
    }
  }
};

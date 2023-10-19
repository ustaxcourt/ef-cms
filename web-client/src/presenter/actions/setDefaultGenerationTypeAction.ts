import { state } from '@web-client/presenter/app.cerebral';

export const setDefaultGenerationTypeAction = ({
  applicationContext,
  props,
  store,
}: ActionProps<{
  key: string;
  value: string;
}>) => {
  const { GENERATION_TYPES } = applicationContext.getConstants();

  if (props.key === 'eventCode') {
    if (props.value === 'EA') {
      store.set(state.form.generationType, GENERATION_TYPES.AUTO);
    } else {
      store.set(state.form.generationType, GENERATION_TYPES.MANUAL);
    }
  }
};

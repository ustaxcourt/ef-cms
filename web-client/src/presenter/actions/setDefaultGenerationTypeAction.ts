import { state } from '@web-client/presenter/app.cerebral';

export const setDefaultGenerationTypeAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps<{
  key: string;
  value: string;
}>) => {
  const { GENERATION_TYPES, SERVICE_INDICATOR_TYPES } =
    applicationContext.getConstants();

  const somePartiesHavePaper = get(state.caseDetail.petitioners).some(
    party => party.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER,
  );

  if (props.key === 'eventCode') {
    if (props.value === 'EA' && !somePartiesHavePaper) {
      store.set(state.form.generationType, GENERATION_TYPES.AUTO);
    } else {
      store.set(state.form.generationType, GENERATION_TYPES.MANUAL);
    }
  }
};

import { state } from '@web-client/presenter/app.cerebral';

export const setDefaultGenerationTypeAction = ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  const { GENERATION_TYPES, USER_ROLES } = applicationContext.getConstants();
  const user = applicationContext.getCurrentUser();

  if (props.key === 'eventCode') {
    if (props.value === 'EA') {
      store.set(state.form.generationType, GENERATION_TYPES.AUTO);
      store.set(state.form.fileAcrossConsolidatedGroup, false);
      store.set(state.allowExternalConsolidatedGroupFiling, false);
    } else {
      store.set(state.form.generationType, GENERATION_TYPES.MANUAL);
      if (user.role === USER_ROLES.irsPractitioner) {
        store.set(state.form.fileAcrossConsolidatedGroup, true);
        store.set(state.allowExternalConsolidatedGroupFiling, true);
      }
    }
  }

  if (props.key === 'generationType') {
    if (props.value === 'manual' && user.role === USER_ROLES.irsPractitioner) {
      store.set(state.form.fileAcrossConsolidatedGroup, true);
      store.set(state.allowExternalConsolidatedGroupFiling, true);
    }
  }
};

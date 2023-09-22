import { state } from '@web-client/presenter/app.cerebral';

export const setDefaultGenerationTypeAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const { GENERATION_TYPES, USER_ROLES } = applicationContext.getConstants();
  const user = applicationContext.getCurrentUser();
  const { leadDocketNumber } = get(state.caseDetail);

  if (props.key === 'eventCode') {
    if (props.value === 'EA') {
      store.set(state.form.generationType, GENERATION_TYPES.AUTO);
      store.set(state.form.fileAcrossConsolidatedGroup, false);
    } else {
      store.set(state.form.generationType, GENERATION_TYPES.MANUAL);
      if (user.role === USER_ROLES.irsPractitioner && !!leadDocketNumber) {
        store.set(state.form.fileAcrossConsolidatedGroup, true);
      }
    }
  }

  if (props.key === 'generationType') {
    if (
      props.value === GENERATION_TYPES.MANUAL &&
      user.role === USER_ROLES.irsPractitioner &&
      !!leadDocketNumber
    ) {
      store.set(state.form.fileAcrossConsolidatedGroup, true);
    }

    if (props.value === GENERATION_TYPES.AUTO) {
      store.set(state.form.fileAcrossConsolidatedGroup, false);
    }
  }
};

import {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const setDefaultGenerationTypeAction = async ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps<{
  key: string;
  value: string;
}>) => {
  const { GENERATION_TYPES } = applicationContext.getConstants();

  const petitioners = get(state.caseDetail.petitioners);
  const user = await applicationContext.getCurrentUser();

  if (props.key === 'eventCode') {
    const showGenerationTypeForm = showGenerationType(
      user,
      props.value,
      petitioners,
    );
    if (showGenerationTypeForm) {
      store.set(state.form.generationType, GENERATION_TYPES.AUTO);
    } else {
      store.set(state.form.generationType, GENERATION_TYPES.MANUAL);
    }
  }
};

export function showGenerationType(
  user: { role: string },
  eventCode: string,
  petitioners: { serviceIndicator?: string }[],
): boolean {
  if (eventCode !== 'EA') return false;
  const somePartiesHavePaper = petitioners.some(
    party => party.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER,
  );
  return user.role === ROLES.privatePractitioner || !somePartiesHavePaper;
}

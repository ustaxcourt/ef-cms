import { getUTCDate } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const setTokenAction = ({
  applicationContext,
  props,
  store,
}: ActionProps<{ token: string; refreshToken: string }>): void => {
  const expiresAtIso = applicationContext.getUtilities().calculateISODate({
    dateString: applicationContext.getUtilities().createISODateString(),
    howMuch: 29,
    units: 'days',
  });

  const expiresAt = getUTCDate(expiresAtIso);
  window.document.cookie = `refreshToken=${props.refreshToken}; path=/; expires=${expiresAt};`;

  store.set(state.token, props.token);
  store.set(state.refreshToken, props.refreshToken || null);
  applicationContext.setCurrentUserToken(props.token);
};

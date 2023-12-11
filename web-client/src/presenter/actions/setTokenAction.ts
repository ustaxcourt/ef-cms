import { state } from '@web-client/presenter/app.cerebral';

export const setTokenAction = ({
  applicationContext,
  props,
  store,
}: ActionProps<{ token: string; refreshToken: string }>): void => {
  const expiresAt = applicationContext.getUtilities().calculateISODate({
    dateString: applicationContext.getUtilities().createISODateString(),
    howMuch: 29,
    units: 'days',
  });
  // eslint-disable-next-line @miovision/disallow-date/no-new-date
  const expires = new Date(expiresAt);
  const path = '/auth';
  const httpOnly = false; // TODO should be true if not local
  window.document.cookie = `refreshToken=${props.refreshToken}; expires=${expires}; path=${path}; secure=true; httpOnly=${httpOnly}`;

  store.set(state.token, props.token);
  store.set(state.refreshToken, props.refreshToken || null);
  applicationContext.setCurrentUserToken(props.token);
};

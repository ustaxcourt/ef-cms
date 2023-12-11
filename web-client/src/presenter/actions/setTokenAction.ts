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

  const path = '/';
  const httpOnly = false; // TODO should be true if not local
  // window.document.cookie = `refreshToken=${props.refreshToken}; expires=${expires}; path=${path}; secure=true; httpOnly=${httpOnly}`;
  window.document.cookie = `refreshToken=${props.refreshToken}; path=${path}; expires=${expires};`;

  store.set(state.token, props.token);
  store.set(state.refreshToken, props.refreshToken || null);
  applicationContext.setCurrentUserToken(props.token);
};

import { state } from '@web-client/presenter/app.cerebral';

export const redirectToCognitoAction = ({ get, router }: ActionProps) => {
  router.externalRoute(get(state.cognitoLoginUrl));
};

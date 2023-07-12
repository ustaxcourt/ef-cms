import { state } from 'cerebral';

export const redirectToCognitoAction = ({ get, router }: ActionProps) => {
  router.externalRoute(get(state.cognitoLoginUrl));
};

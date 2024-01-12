import { state } from '@web-client/presenter/app.cerebral';

export const redirectToChangePasswordAction = ({ get, router }) => {
  const a = get(state.cognitoPasswordChange);
  console.log(`get(state.cognitoPasswordChange)[${a}]`);

  router.externalRoute(get(state.cognitoPasswordChange));
};

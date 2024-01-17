import { state } from '@web-client/presenter/app.cerebral';

export const clearAuthStateAction = ({ store }: ActionProps) => {
  //TODO: 10007 set these defaults back to ''
  store.set(state.authentication, {
    form: {
      confirmPassword: undefined,
      email: undefined,
      password: undefined,
    },
    tempPassword: undefined,
    userEmail: undefined,
  });
};

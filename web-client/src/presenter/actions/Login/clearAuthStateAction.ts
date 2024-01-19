import { state } from '@web-client/presenter/app.cerebral';

export const clearAuthStateAction = ({ store }: ActionProps) => {
  store.set(state.authentication, {
    forgotPassword: {
      code: '',
      email: '',
      userId: '',
    },
    form: {
      confirmPassword: '',
      email: '',
      password: '',
    },
    tempPassword: '',
    userEmail: '',
  });
};

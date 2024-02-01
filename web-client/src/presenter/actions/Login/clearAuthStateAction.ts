import { state } from '@web-client/presenter/app.cerebral';

export const clearAuthStateAction = ({ store }: ActionProps) => {
  store.set(state.authentication, {
    code: '',
    form: {
      confirmPassword: '',
      email: '',
      password: '',
    },
    tempPassword: '',
  });
};

import { state } from '@web-client/presenter/app-public.cerebral';

export const submitLoginSequence = [
  async ({ applicationContext, get }) => {
    const { email, password } = get(state.form);
    console.log('in submitLoginSequence');
    console.log(email, password);

    await applicationContext
      .getUseCases()
      .logInInteractor(applicationContext, { email, password });

    // router.externalRoute(
    //   `http://localhost:1234/log-in?code=${result.code}`,
    // );
  },
] as unknown as (props) => void;

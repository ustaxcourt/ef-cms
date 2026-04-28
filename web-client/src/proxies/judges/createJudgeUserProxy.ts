import { post } from '../requests';

export const createJudgeUserInteractor = ({ applicationContext, user }) => {
  return post({
    applicationContext,
    body: { user },
    endpoint: '/judges',
  });
};

import { RawUser } from '@shared/business/entities/User';
import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const passAlongJudgeUserAction = ({
  get,
}: ActionProps): { judgeUser: RawUser } => {
  return { judgeUser: cloneDeep(get(state.user)) };
};

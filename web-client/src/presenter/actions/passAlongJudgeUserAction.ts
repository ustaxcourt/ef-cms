import { RawUser } from '@shared/business/entities/User';
import { cloneDeep } from 'lodash';

export const passAlongJudgeUserAction = ({
  applicationContext,
}: ActionProps): { judgeUser: RawUser } => {
  return { judgeUser: cloneDeep(applicationContext.getCurrentUser()) };
};

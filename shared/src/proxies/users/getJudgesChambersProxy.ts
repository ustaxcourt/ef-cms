import { get } from '../requests';

export interface JudgeChambersInfo {
  label: string;
  judgeFullName: string;
  phoneNumber?: string;
  section: string;
  isLegacy?: boolean;
}

export const getJudgesChambersInteractor = (
  applicationContext,
): Promise<JudgeChambersInfo[]> => {
  return get({
    applicationContext,
    endpoint: '/sections/chambers',
  });
};

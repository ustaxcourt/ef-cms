import { get } from '../requests';

// TODO: Avoid duplicating and move somewhere sensible
interface JudgeChambersInfo {
  label: string;
  judgeFullName: string;
  phoneNumber: string;
  section: string;
  isLegacy: boolean;
}

export const getJudgesChambersInteractor = (
  applicationContext,
): Promise<JudgeChambersInfo[]> => {
  return get({
    applicationContext,
    endpoint: '/sections/chambers',
  });
};

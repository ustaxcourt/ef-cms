import { RawUser } from '@shared/business/entities/User';
import { isEmpty, sortBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export interface JudgeChambersInfo {
  label: string;
  judgeFullName: string;
  phoneNumber?: string;
  section: string;
  isLegacy?: boolean;
}

const pluralizeChambersLabel = (judgeName: string) => {
  return judgeName.endsWith('s')
    ? judgeName + '’ Chambers'
    : judgeName + '’s Chambers';
};

export const getJudgesChambersAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const judgesChambersCached = get(state.judgesChambers);
  if (!isEmpty(judgesChambersCached)) {
    return { judgesChambers: judgesChambersCached };
  }

  const judgeUsers: RawUser[] = await applicationContext
    .getUseCases()
    .getUsersInSectionInteractor(applicationContext, { section: 'judge' });

  const judgesChambers: JudgeChambersInfo[] = judgeUsers.map(u => {
    const phoneNumber = u.judgePhoneNumber;
    const label = pluralizeChambersLabel(u.name);
    return {
      isLegacy: u.section === 'legacyJudgesChambers',
      judgeFullName: u.judgeFullName,
      label,
      phoneNumber,
      section: u.section,
    } as JudgeChambersInfo;
  });

  const filteredJudgesChambers = judgesChambers.filter(
    chambers => !chambers.isLegacy,
  );

  return {
    judgesChambers: sortBy(filteredJudgesChambers, 'label'),
  };
};

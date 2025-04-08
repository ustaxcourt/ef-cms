import { getUsersInSection } from '@web-api/persistence/postgres/users/getUsersInSection';

export const getJudgeWithTitle = async ({
  judgeUserName,
  useFullName = false,
}) => {
  const judges = await getUsersInSection({ section: 'judge' });

  const foundJudge = judges.find(_judge => _judge.name === judgeUserName);

  if (!foundJudge) {
    throw new Error(`Judge ${judgeUserName} was not found`);
  }

  const judgeName = useFullName ? foundJudge.judgeFullName : foundJudge.name;

  return `${foundJudge.judgeTitle} ${judgeName}`;
};

import { trimSeniorPrefix } from '@web-client/presenter/actions/computeJudgeNameWithTitleAction';

export const getJudgeWithTitle = async ({
  applicationContext,
  judgeUserName,
  useFullName = false,
}) => {
  const judges = await applicationContext
    .getPersistenceGateway()
    .getUsersInSection({
      applicationContext,
      section: 'judge',
    });

  const foundJudge = judges.find(_judge => _judge.name === judgeUserName);

  if (!foundJudge) {
    throw new Error(`Judge ${judgeUserName} was not found`);
  }

  const judgeName = useFullName ? foundJudge.judgeFullName : foundJudge.name;

  return `${trimSeniorPrefix(foundJudge.judgeTitle)} ${judgeName}`;
};

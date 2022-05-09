const getJudgeWithTitle = async ({
  applicationContext,
  judgeUserName,
  shouldReturnFullName = false,
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

  const judgeName = shouldReturnFullName
    ? foundJudge.fullName
    : foundJudge.name;

  return `${foundJudge.judgeTitle} ${judgeName}`;
};

module.exports = {
  getJudgeWithTitle,
};

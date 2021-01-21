const getJudgeWithTitle = async ({ applicationContext, judgeUserName }) => {
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

  return `${foundJudge.judgeTitle} ${foundJudge.name}`;
};

module.exports = {
  getJudgeWithTitle,
};

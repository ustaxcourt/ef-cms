const formatJudgeName = name => {
  if (!name) {
    return '';
  }

  return name.replace(/^Judge\s+/, '');
};

const getJudgeLastName = name => {
  const nameWithoutJudgeTitle = formatJudgeName(name);
  const nameArray = nameWithoutJudgeTitle.split(' ');

  return nameArray[nameArray.length - 1];
};

module.exports = {
  formatJudgeName,
  getJudgeLastName,
};

const { parseFullName } = require('parse-full-name');

const formatJudgeName = name => {
  if (!name) {
    return '';
  }

  return name.replace(/^Judge\s+/, '');
};

const getJudgeLastName = name => {
  const { last: lastName } = parseFullName(name);
  return lastName;
};

module.exports = {
  formatJudgeName,
  getJudgeLastName,
};

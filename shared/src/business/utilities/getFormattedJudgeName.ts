import { parseFullName } from 'parse-full-name';

export const formatJudgeName = name => {
  if (!name) {
    return '';
  }

  return name.replace(/^Judge\s+/, '');
};

export const getJudgeLastName = name => {
  const { last: lastName } = parseFullName(name);
  return lastName;
};

import * as readline from 'node:readline/promises';

const defaultEmailHost = 'ustaxcourt.gov';

export const getChambersNameFromJudgeName = (judgeName: string) => {
  return judgeName.endsWith('s')
    ? `${judgeName.toLowerCase()}Chambers`
    : `${judgeName.toLowerCase()}sChambers`;
};

export async function promptUser(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await rl.question(query);
  rl.close();
  return answer;
}

export const expectedEmailFormats = (name: string): string[] => {
  const lowerCaseName = name.toLowerCase();
  return [
    `stjudge.${lowerCaseName}@${defaultEmailHost}`, // Special Trial judges
    `judge.${lowerCaseName}@${defaultEmailHost}`, // Regular judges
  ];
};

export const emailIsInExpectedFormat = ({
  email,
  judgeName,
}: {
  judgeName: string;
  email: string;
}): boolean => {
  return expectedEmailFormats(judgeName).includes(email.toLowerCase());
};

export const phoneIsInExpectedFormat = (phone: string) => {
  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
  return phoneRegex.test(phone);
};

export const expectedJudgeTitles = [
  'Judge',
  'Special Trial Judge',
  'Chief Judge',
  'Chief Special Trial Judge',
];

export const judgeTitleIsInExpectedFormat = (judgeTitle: string): boolean => {
  return expectedJudgeTitles.includes(judgeTitle);
};

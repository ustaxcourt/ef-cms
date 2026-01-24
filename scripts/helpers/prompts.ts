import * as readline from 'node:readline/promises';

export const ask = async (query: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await rl.question(query);
  rl.close();
  return answer;
};

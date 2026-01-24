import * as readline from 'node:readline/promises';
import inquirer from 'inquirer';

export const ask = async (query: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await rl.question(query);
  rl.close();
  return answer;
};

export const choose = async (
  query: string,
  choices: string[],
): Promise<string> => {
  const { choice } = await inquirer.prompt([
    {
      choices,
      message: query,
      name: 'choice',
      type: 'list',
    },
  ]);

  return choice;
};

jest.mock('node:readline/promises', () => ({
  createInterface: jest.fn(),
}));
jest.mock('inquirer', () => ({
  __esModule: true,
  default: { prompt: jest.fn() },
}));
import { ask, choose } from './prompts';

describe('prompts', () => {
  describe('ask', () => {
    it('should ask a question and return the answer', async () => {
      const readline = jest.requireMock('node:readline/promises') as {
        createInterface: jest.Mock;
      };
      const mockQuestion = jest.fn().mockResolvedValue('jest');
      const mockClose = jest.fn();
      readline.createInterface.mockReturnValue({
        question: mockQuestion,
        close: mockClose,
      } as any);

      const result = await ask('What is your name?');

      const readlineAgain = jest.requireMock('node:readline/promises') as {
        createInterface: jest.Mock;
      };
      expect(readlineAgain.createInterface).toHaveBeenCalledWith({
        input: process.stdin,
        output: process.stdout,
      });
      expect(mockQuestion).toHaveBeenCalledWith('What is your name?');
      expect(mockClose).toHaveBeenCalled();
      expect(result).toBe('jest');
    });
  });

  describe('choose', () => {
    it('should show choices and return the selected choice', async () => {
      const inquirer = (await import('inquirer')).default as unknown as {
        prompt: jest.Mock;
      };
      inquirer.prompt.mockResolvedValue({ choice: 'Option 2' });

      const choices = ['Option 1', 'Option 2'];
      const result = await choose('Select an option', choices);

      expect(inquirer.prompt).toHaveBeenCalledWith([
        {
          choices,
          message: 'Select an option',
          name: 'choice',
          type: 'list',
        },
      ]);
      expect(result).toBe('Option 2');
    });
  });
});

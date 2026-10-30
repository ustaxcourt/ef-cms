jest.mock('node:readline/promises', () => ({
  createInterface: jest.fn(),
}));
import { PassThrough } from 'node:stream';
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
    // Drives the real inquirer prompt through a fake stdin/stdout so these
    // tests exercise what a CLI user actually sees and presses
    const DOWN_ARROW = '\x1B[B';
    const UP_ARROW = '\x1B[A';
    const ENTER = '\r';
    const QUERY = 'Select an option';
    const CHOICES = ['Option 1', 'Option 2', 'Option 3'];
    const originalStdin = process.stdin;
    let fakeStdin: PassThrough;
    let renderedOutput: string;

    beforeEach(() => {
      fakeStdin = new PassThrough();
      Object.defineProperty(process, 'stdin', {
        configurable: true,
        value: fakeStdin,
      });
      renderedOutput = '';
      jest.spyOn(process.stdout, 'write').mockImplementation(chunk => {
        renderedOutput += chunk.toString();
        return true;
      });
    });

    afterEach(() => {
      Object.defineProperty(process, 'stdin', {
        configurable: true,
        value: originalStdin,
      });
      jest.restoreAllMocks();
    });

    const waitForPrompt = async () => {
      while (!renderedOutput.includes(QUERY)) {
        await new Promise(resolve => setTimeout(resolve, 5));
      }
    };

    const answerPrompt = async (...keys: string[]) => {
      await waitForPrompt();
      keys.forEach(key => fakeStdin.write(key));
    };

    it('should return the first choice when the user presses enter', async () => {
      const result = choose(QUERY, CHOICES);
      await answerPrompt(ENTER);

      await expect(result).resolves.toBe('Option 1');
    });

    it('should return the highlighted choice after the user arrows down then up', async () => {
      const result = choose(QUERY, CHOICES);
      await answerPrompt(DOWN_ARROW, DOWN_ARROW, UP_ARROW, ENTER);

      await expect(result).resolves.toBe('Option 2');
    });
  });
});

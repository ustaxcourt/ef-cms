const mockSend = jest.fn();

jest.mock('@web-api/persistence/ssm/getSsmClient', () => ({
  getSsmClient: () => ({
    send: mockSend,
  }),
}));

import { getSsmParameter, updateSsmParameter } from './ssmClientService';

describe('ssmClientService', () => {
  const applicationContext: any = {
    environment: {
      stage: 'local',
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSsmParameter', () => {
    it('should return value from local store when stage is local', async () => {
      await updateSsmParameter({
        applicationContext,
        parameterName: 'testParam',
        value: 'testValue',
      });

      const result = await getSsmParameter({
        applicationContext,
        parameterName: 'testParam',
      });

      expect(result).toBe('testValue');
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('should return undefined for a missing local parameter', async () => {
      const result = await getSsmParameter({
        applicationContext,
        parameterName: 'nonExistent',
      });

      expect(result).toBeUndefined();
    });

    it('should call SSMClient.send when stage is not local', async () => {
      const nonLocalApplicationContext: any = {
        environment: { stage: 'dev' },
      };

      mockSend.mockResolvedValueOnce({
        Parameter: { Value: 'remote-value' },
      });

      const result = await getSsmParameter({
        applicationContext: nonLocalApplicationContext,
        parameterName: 'testParam',
      });

      expect(mockSend).toHaveBeenCalled();
      expect(result).toBe('remote-value');
    });
  });

  describe('updateSsmParameter', () => {
    it('should store value locally when stage is local', async () => {
      await updateSsmParameter({
        applicationContext,
        parameterName: 'localParam',
        value: 42,
      });

      const result = await getSsmParameter({
        applicationContext,
        parameterName: 'localParam',
      });

      expect(result).toBe('42');
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('should call SSMClient.send when stage is not local', async () => {
      const nonLocalApplicationContext: any = {
        environment: { stage: 'dev' },
      };

      mockSend.mockResolvedValueOnce({});

      await updateSsmParameter({
        applicationContext: nonLocalApplicationContext,
        parameterName: 'testParam',
        value: 'newValue',
      });

      expect(mockSend).toHaveBeenCalled();
    });
  });
});

import { getSesStatus } from './getSesStatus';

const send = jest.fn();

const applicationContext: any = {
  getEmailClient: () => ({
    send,
  }),
  logger: { error: () => true, info: () => true },
};

describe('getSesStatus', () => {
  it('should pass the email client successfully gets send statistics', async () => {
    send.mockResolvedValueOnce({
      SendDataPoints: [
        {
          Rejects: 0,
        },
      ],
    });

    const status = await getSesStatus({
      applicationContext,
    });
    expect(status).toEqual(true);
  });

  it('should fail when the email client fails to get send statistics', async () => {
    send.mockResolvedValueOnce({
      SendDataPoints: [
        {
          Rejects: 1,
        },
      ],
    });

    const status = await getSesStatus({
      applicationContext,
    });

    expect(status).toEqual(false);
  });
});

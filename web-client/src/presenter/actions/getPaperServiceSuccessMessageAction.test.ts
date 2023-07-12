import { getPaperServiceSuccessMessageAction } from './getPaperServiceSuccessMessageAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getPaperServiceSuccessMessageAction', () => {
  it('returns the default paper service success alert when alertSuccess is not in state', async () => {
    const results = await runAction(getPaperServiceSuccessMessageAction, {
      state: {},
    });

    expect(results.output.alertSuccess).toEqual({
      message: 'Your entry has been added to the docket record.',
    });
  });

  it('returns default paper service success alert if overwritable set to true', async () => {
    const results = await runAction(getPaperServiceSuccessMessageAction, {
      state: {
        alertSuccess: {
          message: 'Original message',
          overwritable: true,
        },
      },
    });

    expect(results.output.alertSuccess).toEqual({
      message: 'Your entry has been added to the docket record.',
    });
  });

  it('returns default paper service success alert if overwritable not defined', async () => {
    const results = await runAction(getPaperServiceSuccessMessageAction, {
      state: {
        alertSuccess: {
          message: 'Original message',
        },
      },
    });

    expect(results.output.alertSuccess).toEqual({
      message: 'Your entry has been added to the docket record.',
    });
  });

  it('returns original paper service success alert if overwritable set to false', async () => {
    const results = await runAction(getPaperServiceSuccessMessageAction, {
      state: {
        alertSuccess: {
          message: 'Original message',
          overwritable: false,
        },
      },
    });

    expect(results.output.alertSuccess).toEqual({
      message: 'Original message',
    });
  });
});

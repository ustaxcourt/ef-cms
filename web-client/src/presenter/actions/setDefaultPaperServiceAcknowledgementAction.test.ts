import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultPaperServiceAcknowledgementAction } from './setDefaultPaperServiceAcknowledgementAction';

describe('setDefaultPaperServiceAcknowledgementAction', () => {
  it('should set the paper service acknowledgement to false when a petitioner has paper service', async () => {
    const result = await runAction(
      setDefaultPaperServiceAcknowledgementAction,
      {
        state: {
          caseDetail: {
            petitioners: [
              {
                serviceIndicator: 'Paper',
              },
            ],
          },
          form: {},
        },
      },
    );

    expect(result.state.form.paperServiceAcknowledgement).toBe(false);
  });

  it('should unset the paper service acknowledgement when no petitioner has paper service', async () => {
    const result = await runAction(
      setDefaultPaperServiceAcknowledgementAction,
      {
        state: {
          caseDetail: {
            petitioners: [
              {
                serviceIndicator: 'Electronic',
              },
            ],
          },
          form: {},
        },
      },
    );

    expect(result.state.form.paperServiceAcknowledgement).toBeUndefined();
  });
});

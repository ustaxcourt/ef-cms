import { formatPetitionFactsAndReasonsAction } from '@web-client/presenter/actions/formatPetitionFactsAndReasonsAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('formatPetitionFactsAndReasonsAction', () => {
  it('should filter empty reasons and facts', async () => {
    const results = await runAction(formatPetitionFactsAndReasonsAction, {
      state: {
        form: {
          petitionFacts: ['fact1', '', 'fact2', 'fact3'],
          petitionReasons: ['reason1', '', 'reason2', ''],
        },
      },
    });

    const { petitionFacts, petitionReasons } = results.state.form;

    expect(petitionFacts).toEqual(['fact1', 'fact2', 'fact3']);
    expect(petitionReasons).toEqual(['reason1', 'reason2']);
  });

  it('should default reasons and facts when no values are present', async () => {
    const results = await runAction(formatPetitionFactsAndReasonsAction, {
      state: {
        form: {
          petitionFacts: ['', '', '', ''],
          petitionReasons: ['', ''],
        },
      },
    });

    const { petitionFacts, petitionReasons } = results.state.form;
    expect(petitionFacts).toEqual(['']);
    expect(petitionReasons).toEqual(['']);
  });
});

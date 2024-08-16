import { getCreatePetitionStep2DataAction } from '@web-client/presenter/actions/getCreatePetitionStep2DataAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getCreatePetitionStep2DataAction', () => {
  it('should fetch Petition Information related data from state.form', async () => {
    const results = await runAction(getCreatePetitionStep2DataAction, {
      state: {
        form: {
          petitionFacts: 'TEST_petitionFacts',
          petitionFile: 'TEST_petitionFile',
          petitionFileSize: 'TEST_petitionFileSize',
          petitionReasons: 'TEST_petitionReasons',
          petitionRedactionAcknowledgement:
            'TEST_petitionRedactionAcknowledgement',
          petitionType: 'TEST_petitionType',
          test1: 'TEST_test1',
          test2: 'TEST_test2',
          test3: 'TEST_test3',
        },
      },
    });

    const { createPetitionStep2Data } = results.output;
    expect(createPetitionStep2Data).toEqual({
      petitionFacts: 'TEST_petitionFacts',
      petitionFile: 'TEST_petitionFile',
      petitionFileSize: 'TEST_petitionFileSize',
      petitionReasons: 'TEST_petitionReasons',
      petitionRedactionAcknowledgement: 'TEST_petitionRedactionAcknowledgement',
      petitionType: 'TEST_petitionType',
    });
  });
});

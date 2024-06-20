import { getFilePetitionPetitionInformationAction } from '@web-client/presenter/actions/getFilePetitionPetitionInformationAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getFilePetitionPetitionInformationAction', () => {
  it('should fetch Petition Information related data from state.form', async () => {
    const results = await runAction(getFilePetitionPetitionInformationAction, {
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

    const { petitionInformation } = results.output;
    expect(petitionInformation).toEqual({
      petitionFacts: 'TEST_petitionFacts',
      petitionFile: 'TEST_petitionFile',
      petitionFileSize: 'TEST_petitionFileSize',
      petitionReasons: 'TEST_petitionReasons',
      petitionRedactionAcknowledgement: 'TEST_petitionRedactionAcknowledgement',
      petitionType: 'TEST_petitionType',
    });
  });
});

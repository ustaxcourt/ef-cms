import { clearPetitionFormAction } from './clearPetitionFormAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearPetitionFormAction', () => {
  it('should set clear petition form details', async () => {
    const result = await runAction(clearPetitionFormAction, {
      state: {
        form: {
          petitionFacts: ['here is a fact'],
          petitionFile: new File([], 'test.pdf'),
          petitionFileSize: 1,
          petitionFileUrl: '/url',
          petitionReasons: ['here is a reason'],
          petitionRedactionAcknowledgement: true,
          petitionType: 'userUploaded',
        },
      },
    });

    expect(result.state.form.petitionFacts).toEqual(['']);
    expect(result.state.form.petitionFile).toEqual(undefined);
    expect(result.state.form.petitionFileUrl).toEqual(undefined);
    expect(result.state.form.petitionFileSize).toEqual(undefined);
    expect(result.state.form.petitionReasons).toEqual(['']);
    expect(result.state.form.petitionRedactionAcknowledgement).toEqual(
      undefined,
    );
    expect(result.state.form.petitionType).toEqual(undefined);
  });
});

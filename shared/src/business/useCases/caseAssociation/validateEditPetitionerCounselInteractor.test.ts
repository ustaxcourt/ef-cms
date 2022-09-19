import { validateEditPetitionerCounselInteractor } from './validateEditPetitionerCounselInteractor';

describe('validateEditPetitionerCounselInteractor', () => {
  it('should return the expected errors when the petitioner counsel is invalid', () => {
    const errors = validateEditPetitionerCounselInteractor({
      practitioner: {},
    });

    expect(Object.keys(errors)).toEqual(['representing']);
  });

  it('should return null when the petitioner counsel to edit is valid', () => {
    const errors = validateEditPetitionerCounselInteractor({
      practitioner: { representing: ['f56624e1-853e-44bb-aff3-e9947780d247'] },
    });
    expect(errors).toEqual(null);
  });
});

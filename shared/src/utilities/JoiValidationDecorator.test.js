const { joiValidationDecorator } = require('./JoiValidationDecorator');
const joi = require('joi-browser');

function MockEntity1(raw) {
  Object.assign(this, raw);
}
MockEntity1.name = 'MockEntity1';

MockEntity1.errorToMessageMap = {
  name: 'Name is definitely a required field.',
  favoriteNumber: 'Tell me your favorite number.',
};

joiValidationDecorator(
  MockEntity1,
  joi.object().keys({
    name: joi.string().required(),
    hasNickname: joi.boolean().required(),
    favoriteNumber: joi.number().required(),
  }),
  undefined,
  MockEntity1.errorToMessageMap,
);

const MockEntity2 = function(raw) {
  Object.assign(this, raw);
};

joiValidationDecorator(
  MockEntity2,
  joi.object().keys({
    obj1: joi
      .object()
      .keys({ foo: joi.string().required() })
      .required(),
    arry1: joi
      .array()
      .items(joi.object().keys({ foo: joi.string().required() }))
      .required(),
    name: joi.string().required(),
    hasNickname: joi.boolean().required(),
    favoriteNumber: joi.number().required(),
  }),
  undefined,
  { arry1: 'That is required', foo: 'lend me some sugar' },
);

describe('Joi Validation Decorator', () => {
  describe('validation errors with arrays', () => {
    it('returns validation errors', () => {
      const validNested = new MockEntity1({
        name: 'name',
        hasNickname: false,
        favoriteNumber: 7,
      });
      const obj = new MockEntity2({
        name: 'Name',
        arry1: [{ foo: 'bar', baz: validNested }, {}],
        optionalThing: validNested,
      });
      expect(obj.isValid()).toBe(false);
      const errors = obj.getFormattedValidationErrors();
      expect(Object.keys(errors).length).not.toBe(0);
    });
  });
});

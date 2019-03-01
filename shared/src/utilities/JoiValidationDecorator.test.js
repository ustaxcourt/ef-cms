const { joiValidationDecorator } = require('./JoiValidationDecorator');
const joi = require('joi-browser');

function MockEntity1(raw) {
  Object.assign(this, raw);
}
MockEntity1.name = 'MockEntity1';

MockEntity1.errorToMessageMap = {
  favoriteNumber: 'Tell me your favorite number.',
  name: 'Name is definitely a required field.',
};

joiValidationDecorator(
  MockEntity1,
  joi.object().keys({
    favoriteNumber: joi.number().required(),
    hasNickname: joi.boolean().required(),
    name: joi.string().required(),
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
    arry1: joi
      .array()
      .items(joi.object().keys({ foo: joi.string().required() }))
      .required(),
    favoriteNumber: joi.number().required(),
    hasNickname: joi.boolean().required(),
    name: joi.string().required(),
    obj1: joi
      .object()
      .keys({ foo: joi.string().required() })
      .required(),
  }),
  undefined,
  { arry1: 'That is required', foo: 'lend me some sugar' },
);

describe('Joi Validation Decorator', () => {
  describe('validation errors with arrays', () => {
    it('returns validation errors', () => {
      const validNested = new MockEntity1({
        favoriteNumber: 7,
        hasNickname: false,
        name: 'name',
      });
      const obj = new MockEntity2({
        arry1: [{ baz: validNested, foo: 'bar' }, {}],
        name: 'Name',
        optionalThing: validNested,
      });
      expect(obj.isValid()).toBe(false);
      const errors = obj.getFormattedValidationErrors();
      expect(Object.keys(errors).length).not.toBe(0);
    });
  });
});

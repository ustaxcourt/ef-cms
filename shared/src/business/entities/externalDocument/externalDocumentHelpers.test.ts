import { JoiValidationConstants } from '../JoiValidationConstants';
import {
  addPropertyHelper,
  makeRequiredHelper,
} from './externalDocumentHelpers';

describe('external document helpers', () => {
  describe('addPropertyHelper', () => {
    it('should add a property to the schema without a custom error message', () => {
      const schema = {
        something: true,
        somethingElse: undefined,
      };

      addPropertyHelper({
        errorToMessageMap: undefined,
        itemErrorMessage: undefined,
        itemName: 'somethingElse',
        itemSchema: false,
        schema,
      });

      expect(schema.somethingElse).toEqual(false);
    });
  });

  describe('makeRequiredHelper', () => {
    it('should make an optional field required', () => {
      const schema = {
        something: JoiValidationConstants.STRING.required(),
        somethingElse: undefined,
      };
      const schemaOptionalItems = {
        somethingElse: JoiValidationConstants.STRING,
      };
      makeRequiredHelper({
        itemName: 'somethingElse',
        schema,
        schemaOptionalItems,
      });
      expect(schema.somethingElse).toEqual(
        JoiValidationConstants.STRING.required(),
      );
    });

    it('should not add an optional field to the schema as required if it does not exist in the schemaOptionalItems', () => {
      const schema = {
        something: JoiValidationConstants.STRING.required(),
        somethingElse2: undefined,
      };
      const schemaOptionalItems = {
        somethingElse: JoiValidationConstants.STRING,
      };
      makeRequiredHelper({
        itemName: 'somethingElse2',
        schema,
        schemaOptionalItems,
      });
      expect(schema.somethingElse2).toEqual(undefined);
    });
  });
});

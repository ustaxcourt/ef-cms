const fs = require('fs');
const { Case } = require('../business/entities/cases/Case');
const { DocketRecord } = require('../business/entities/DocketRecord');
const { Document } = require('../business/entities/Document');

const entitiesDir = `${__dirname}/../../../docs/entities`;

const schema = Case.getSchema();

const generateMarkdownSchema = (schema, entityName) => {
  let described = schema.describe ? schema.describe().keys : schema;
  const fields = Object.keys(described);

  const jsonResult = [{ h1: entityName }];

  const handleField = (field, fieldName) => {
    const { allow, description, flags, matches, rules, type } = field;
    let presence;

    if (flags) {
      ({ presence } = flags);
    }

    const result = [];

    if (fieldName) {
      result.push({ h3: fieldName });
    }

    if (description) {
      result.push({ p: description });
    }

    result.push({
      blockquote: `\`${type}\`${presence ? ` | ${presence}` : ''}`,
    });

    switch (type) {
      default:
      case 'date':
      case 'boolean':
      case 'number':
      case 'string':
        if (rules && rules.length) {
          rules.forEach(({ args, name }) => {
            switch (name) {
              case 'pattern':
                result.push({ h6: 'Regex Pattern' });
                result.push({ p: `\`${args.regex}\`` });
                break;
            }
          });
        }

        if (allow && allow.length > 1) {
          result.push({ h6: 'Allowed Values' });
          result.push({ ul: allow });
        }

        break;

      case 'alternatives':
        matches.forEach(({ schema: matchSchema }) => {
          result.push(...handleField(matchSchema));
        });
        break;

      case 'any':
        // TODO
        break;
    }

    return result;
  };

  fields.forEach(field => {
    jsonResult.push(...handleField(described[field], field));
  });

  return jsonResult;
};

// fs.writeFileSync(
//   'schema.json',
//   JSON.stringify(
generateMarkdownSchema(schema.describe().keys, 'Case');
// null,
// 2,
// ),
// );

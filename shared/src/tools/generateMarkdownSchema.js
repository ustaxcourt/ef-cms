const fs = require('fs');
const json2md = require('json2md');
const { Case } = require('../business/entities/cases/Case');
const { DocketRecord } = require('../business/entities/DocketRecord');
const { Document } = require('../business/entities/Document');

exports.generateJsonFromSchema = (schema, entityName) => {
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
      case 'object':
      // eslint-disable-next-line no-fallthrough
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
          const allowedValues = allow.map(
            allowedValue => `\`${allowedValue}\``,
          );
          result.push({ h6: 'Allowed Values' });
          result.push({ ul: allowedValues });
        }
        break;

      case 'alternatives':
        matches.forEach(({ schema: matchSchema }) => {
          result.push(...handleField(matchSchema));
        });
        break;

      case 'array':
        const { items } = field;
        if (items) {
          items.forEach(({ metas, type }) => {
            if (metas) {
              const metaEntityName = metas[0].entityName;
              result.push({
                p: `An array of [\`${metaEntityName}\`](./${metaEntityName}.md)s`,
              });
            } else {
              result.push({
                p: `An array of ${type}s.`,
              });
            }
          });
        }
        break;

      case 'any':
        const { whens } = field;
        whens.forEach(({ is, otherwise, ref, then }) => {
          result.push({
            p: `If \`${ref.path[0]}\` = \`${is.allow[1]}\`, then this field is \`${then.type}\` and is \`${then.flags.presence}.\` `,
          });
          let otherwiseVerbiage = `Otherwise, this field is \`${otherwise.type}\` and is \`${otherwise.flags.presence}\`.`;
          if (otherwise.allow && otherwise.allow[0] === null) {
            otherwiseVerbiage += ' `null` is allowed.';
          }
          result.push({
            p: otherwiseVerbiage,
          });
        });
        break;
    }

    return result;
  };

  fields.forEach(field => {
    jsonResult.push(...handleField(described[field], field));
  });

  return jsonResult;
};

exports.generateMarkdownSchema = (entity, entityName) => {
  const json = exports.generateJsonFromSchema(entity.getSchema(), entityName);

  fs.writeFileSync(`./docs/entities/${entityName}.md`, json2md(json));
};

exports.generateMarkdownSchema(Case, 'Case');
exports.generateMarkdownSchema(DocketRecord, 'DocketRecord');
exports.generateMarkdownSchema(Document, 'Document');

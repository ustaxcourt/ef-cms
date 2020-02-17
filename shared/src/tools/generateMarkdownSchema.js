const fs = require('fs');
const json2md = require('json2md');
const { Case } = require('../business/entities/cases/Case');
const { CaseDeadline } = require('../business/entities/CaseDeadline');
const { DocketRecord } = require('../business/entities/DocketRecord');
const { Document } = require('../business/entities/Document');

exports.generateJsonFromSchema = (schema, entityName) => {
  let described = schema.describe ? schema.describe().keys : schema;
  const fields = Object.keys(described);

  const jsonResult = [{ h1: entityName }];

  const handleField = (field, fieldName, isAlternative = false, index = 0) => {
    const { allow, flags, matches, metas, rules, type } = field;
    let presence, description;

    if (flags) {
      ({ description, presence } = flags);
    }

    const result = [];

    if (!isAlternative) {
      if (fieldName) {
        result.push({ h3: fieldName });
      }
    } else {
      result.push({ h4: `Condition #${index + 1} for \`${fieldName}\`: ` });
    }

    if (description) {
      result.push({ p: description });
    }

    if (metas) {
      metas.forEach(meta => {
        if (meta['tags']) {
          meta['tags'].forEach(tag => {
            result.push({ p: tag });
          });
        }
      });
    }

    result.push({
      blockquote: `\`${type === 'alternatives' ? 'conditional' : type}\`${
        presence ? ` | ${presence}` : ''
      }`,
    });

    switch (type) {
      default:
      case 'date':
      case 'boolean':
      case 'number':
      case 'object':
      // eslint-disable-next-line spellcheck/spell-checker
      // eslint-disable-next-line no-fallthrough
      case 'string':
        if (rules && rules.length) {
          rules.forEach(({ args, name }) => {
            switch (name) {
              case 'pattern':
                result.push({ h5: 'Regex Pattern' });
                result.push({ p: `\`${args.regex}\`` });
                break;
            }
          });
        }

        if (allow && allow.length > 1) {
          const allowedValues = allow.map(
            allowedValue => `\`${allowedValue}\``,
          );
          result.push({ h5: 'Allowed Values' });
          result.push({ ul: allowedValues });
        } else if (allow && allow.length === 1) {
          result.push({ h5: `Can be ${allow[0]}.` });
        }
        break;

      case 'alternatives':
        result.push({ p: '*Must match 1 of the following conditions:*' });
        matches.forEach(({ schema: matchSchema }, index) => {
          result.push(...handleField(matchSchema, fieldName, true, index));
        });
        break;

      case 'array':
        // eslint-disable-next-line no-case-declarations
        const { items } = field;

        // array item types (e.g. `.items(joi.object())`)
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

        // array rules (min, max, etc.)
        if (rules) {
          result.push({ h4: 'Rules' });

          rules.forEach(({ args, name }) => {
            switch (name) {
              case 'min':
                result.push({
                  p: `At least \`${args.limit}\` item(s) must be selected.`,
                });
            }
          });
        }
        break;

      case 'any':
        // eslint-disable-next-line no-case-declarations
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
exports.generateMarkdownSchema(CaseDeadline, 'CaseDeadline');
exports.generateMarkdownSchema(DocketRecord, 'DocketRecord');
exports.generateMarkdownSchema(Document, 'Document');

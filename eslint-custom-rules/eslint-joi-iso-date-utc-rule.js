const ISO_Z_LITERAL_PATTERN = /\[Z\]/;

const getPropertyName = property => {
  if (!property) {
    return undefined;
  }

  if (property.type === 'Identifier') {
    return property.name;
  }

  if (property.type === 'Literal') {
    return property.value;
  }

  return undefined;
};

const stringLiteralContainsIsoZ = node => {
  return (
    node?.type === 'Literal' &&
    typeof node.value === 'string' &&
    ISO_Z_LITERAL_PATTERN.test(node.value)
  );
};

const formatPatternsContainIsoZ = node => {
  if (stringLiteralContainsIsoZ(node)) {
    return true;
  }

  if (node?.type === 'ArrayExpression') {
    return node.elements.some(element => stringLiteralContainsIsoZ(element));
  }

  if (node?.type === 'Identifier' && node.name === 'ISO_DATE_FORMAT_STRING') {
    return true;
  }

  if (node?.type === 'MemberExpression') {
    return (
      node.object?.type === 'Identifier' &&
      node.object.name === 'DATE_FORMATS' &&
      node.property?.type === 'Identifier' &&
      node.property.name === 'ISO'
    );
  }

  return false;
};

const objectFormatArgNeedsUtc = objectExpression => {
  const formatProperty = objectExpression.properties.find(
    property =>
      property.type === 'Property' &&
      getPropertyName(property.key) === 'format',
  );

  if (!formatProperty || formatProperty.value.type === 'SpreadElement') {
    return false;
  }

  if (!formatPatternsContainIsoZ(formatProperty.value)) {
    return false;
  }

  const utcProperty = objectExpression.properties.find(
    property =>
      property.type === 'Property' && getPropertyName(property.key) === 'utc',
  );

  return !(
    utcProperty &&
    utcProperty.value.type === 'Literal' &&
    utcProperty.value.value === true
  );
};

const isChainedFromJoiValidationConstantsIsoDate = node => {
  const { callee } = node;

  if (
    callee?.type !== 'MemberExpression' ||
    getPropertyName(callee.property) !== 'format'
  ) {
    return false;
  }

  const { object } = callee;

  return (
    object?.type === 'MemberExpression' &&
    object.object?.type === 'Identifier' &&
    object.object.name === 'JoiValidationConstants' &&
    getPropertyName(object.property) === 'ISO_DATE'
  );
};

const joiIsoDateUtcRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require utc: true when @joi/date format strings include a literal Z suffix.',
    },
    messages: {
      missingUtc:
        '@joi/date parses ISO timestamps with a literal `[Z]` in local time unless `utc: true` is set. Use `JoiValidationConstants.ISO_DATE`, chain `.format()` from it, or pass `{ format: "YYYY-MM-DDTHH:mm:ss.SSS[Z]", utc: true }`.',
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        const { callee } = node;

        if (
          callee?.type !== 'MemberExpression' ||
          getPropertyName(callee.property) !== 'format' ||
          isChainedFromJoiValidationConstantsIsoDate(node)
        ) {
          return;
        }

        const [formatArgument] = node.arguments;

        if (!formatArgument) {
          return;
        }

        if (stringLiteralContainsIsoZ(formatArgument)) {
          context.report({ node: formatArgument, messageId: 'missingUtc' });
          return;
        }

        if (
          formatArgument.type === 'ArrayExpression' &&
          formatArgument.elements.some(element =>
            stringLiteralContainsIsoZ(element),
          )
        ) {
          context.report({ node: formatArgument, messageId: 'missingUtc' });
          return;
        }

        if (
          formatArgument.type === 'ObjectExpression' &&
          objectFormatArgNeedsUtc(formatArgument)
        ) {
          context.report({ node: formatArgument, messageId: 'missingUtc' });
        }
      },
    };
  },
};

module.exports = joiIsoDateUtcRule;

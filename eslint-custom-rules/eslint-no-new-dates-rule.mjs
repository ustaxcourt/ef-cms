const noNewDatesRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce no new Date() objects should be created.',
    },
    messages: {
      noNewDates:
        'Using `new Date()` is disallowed. Use the date handler instead.',
    },
    schema: [],
  },
  create(context) {
    return {
      NewExpression(node) {
        if (
          node.callee &&
          node.callee.type === 'Identifier' &&
          node.callee.name === 'Date'
        ) {
          context.report({
            node,
            messageId: 'noNewDates',
          });
        }
      },
    };
  },
};

export default noNewDatesRule;

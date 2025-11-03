const noDatesRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce no Date() objects should be created.',
    },
    messages: {
      noDateUsage: 'Using `Date` is disallowed. Use the date handler instead.',
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
            messageId: 'noDateUsage',
          });
        }
      },
      CallExpression(node) {
        if (
          node.callee &&
          node.callee.type === 'Identifier' &&
          node.callee.name === 'Date'
        ) {
          context.report({ node, messageId: 'noDateUsage' });
        }
      },
      MemberExpression(node) {
        if (
          node.object &&
          node.object.type === 'Identifier' &&
          node.object.name === 'Date'
        ) {
          context.report({ node, messageId: 'noDateUsage' });
        }
      },
    };
  },
};

export default noDatesRule;

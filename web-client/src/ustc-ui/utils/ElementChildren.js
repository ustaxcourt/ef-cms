import React from 'react';

/**
 * Iterates through children that are typically specified as `props.children`,
 * but only maps over children that are "valid elements".
 *
 * The mapFunction provided index will be normalized to the components mapped,
 * so an invalid component would not increase the index.
 *
 * @param {Array} children the html children
 * @param {Function} functionToCall a function to call
 * @returns {Array} the children mapped to function
 */
function map(children, functionToCall) {
  let index = 0;

  return React.Children.map(children, child =>
    React.isValidElement(child) ? functionToCall(child, index++) : child,
  );
}

/**
 * Iterates through children that are "valid elements".
 *
 * The provided forEachFunction(child, index) will be called for each
 * leaf child with the index reflecting the position relative to "valid components".
 *
 * @param  {Array} children the html children
 * @param {Function} functionToCall a function to call
 */
function forEach(children, functionToCall) {
  let index = 0;
  React.Children.forEach(children, child => {
    if (React.isValidElement(child)) functionToCall(child, index++);
  });
}

/**
 * Finds the default attribute from children
 *
 * @param  {Array} children the html children
 * @param {string} attrName a name of the attr
 * @returns {string} active key
 */
function getDefaultAttribute(children, attrName) {
  let defaultActiveKey;
  forEach(children, child => {
    if (defaultActiveKey == null) {
      defaultActiveKey = child.props[attrName];
    }
  });

  return defaultActiveKey;
}

export { map, forEach, getDefaultAttribute };

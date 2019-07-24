import React from 'react';

/**
 * Iterates through children that are typically specified as `props.children`,
 * but only maps over children that are "valid elements".
 *
 * The mapFunction provided index will be normalised to the components mapped,
 * so an invalid component would not increase the index.
 *
 * @param  {Array} children the html children
 * @param {Function} func a function to call
 * @returns {Array} the children mapped to func
 */
function map(children, func) {
  let index = 0;

  return React.Children.map(children, child =>
    React.isValidElement(child) ? func(child, index++) : child,
  );
}

/**
 * Iterates through children that are "valid elements".
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child with the index reflecting the position relative to "valid components".
 *
 * @param  {Array} children the html children
 * @param {Function} func a function to call
 */
function forEach(children, func) {
  let index = 0;
  React.Children.forEach(children, child => {
    if (React.isValidElement(child)) func(child, index++);
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

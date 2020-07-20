import { forEach, getDefaultAttribute, map } from './ElementChildren';
import React from 'react';

describe('map', () => {
  it('should map items and not alter non elements', () => {
    const children = [
      <div key="what">sds</div>,
      22,
      <div key="fetch">something</div>,
    ];

    expect(
      map(children, (child, i) => {
        return i;
      }),
    ).toEqual([0, 22, 1]);
  });

  it('should map items and exclude null values from results', () => {
    const children = [
      <div key="what">sds</div>,
      <div key="whatever">something</div>,
      <div key="fetch">something</div>,
    ];

    expect(
      map(children, child => {
        if (child.key === 'fetch') {
          return null;
        }
        return child;
      }).length,
    ).toEqual(2);
  });
});

describe('forEach', () => {
  it('should loop over items and skip non-react items', () => {
    const children = [
      <div key="what">sds</div>,
      22,
      <div key="fetch">something</div>,
    ];

    let count = 0;

    forEach(children, () => {
      count++;
    });

    expect(count).toEqual(2);
  });
});

describe('getDefaultAttribute', () => {
  it('should find the first attribute and return that attribute', () => {
    const children = [
      <div key="what" kid="someIds">
        sds
      </div>,
      <div id="someId" key="what">
        sds
      </div>,
      22,
      <div id="something" key="fetch">
        something
      </div>,
    ];

    expect(getDefaultAttribute(children, 'id')).toEqual('someId');
  });
});

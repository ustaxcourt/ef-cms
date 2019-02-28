import React from 'react';

import { map, forEach, getDefaultAttribute } from './ElementChildren';

describe('map', () => {
  it('should map items and skip non elements', () => {
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

  it('should map items and exclude null', () => {
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
  it('should map items and exclude null', () => {
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
  it('should map items and exclude null', () => {
    const children = [
      <div key="what" id="someId">
        sds
      </div>,
      22,
      <div key="fetch" id="sdsdf">
        something
      </div>,
    ];

    expect(getDefaultAttribute(children, 'id')).toEqual('someId');
  });
});

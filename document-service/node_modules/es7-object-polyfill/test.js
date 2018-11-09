var assert = require ('chai').assert
var O	   = require ('./es7-object-polyfill')

describe ('Object.values', () => {

	it ('works', () => {

		var _123 = [1,2,3]
		    _123[Symbol.for ('symba')] = 'should not be visible'
		
		assert.deepEqual (O.values  (_123), [1,2,3])
		assert.deepEqual (O.entries (_123), [['0',1], ['1',2], ['2',3]])

		assert.deepEqual (O.values  ({ foo: 44, baz: 45 }), [44, 45])
		assert.deepEqual (O.entries ({ foo: 44, baz: 45 }), [['foo', 44], ['baz', 45]]) }) })
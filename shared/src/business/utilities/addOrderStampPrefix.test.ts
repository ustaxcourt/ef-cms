import { addOrderStampPrefix } from './addOrderStampPrefix';

describe('addOrderStampPrefix', () => {
  it('should add "Order - " prefix when eventCode includes O and text does not start with Order', () => {
    const result = addOrderStampPrefix('O', 'some text');
    expect(result).toBe('Order - some text');
  });

  it('should not add prefix when text already starts with Order', () => {
    const result = addOrderStampPrefix('O', 'Order something');
    expect(result).toBe('Order something');
  });

  it('should not add prefix when eventCode does not include O', () => {
    const result = addOrderStampPrefix('NDT', 'some text');
    expect(result).toBe('some text');
  });

  it('should return undefined when text is undefined', () => {
    const result = addOrderStampPrefix('O', undefined);
    expect(result).toBeUndefined();
  });

  it('should return undefined when text is undefined even if eventCode includes O', () => {
    const result = addOrderStampPrefix('OAJ', undefined);
    expect(result).toBeUndefined();
  });

  it('should handle eventCode that includes O but is not exactly O', () => {
    const result = addOrderStampPrefix('OAJ', 'assign case');
    expect(result).toBe('Order - assign case');
  });

  it('should handle empty string text', () => {
    const result = addOrderStampPrefix('O', '');
    expect(result).toBe('Order - ');
  });

  it('should handle eventCode as empty string', () => {
    const result = addOrderStampPrefix('', 'some text');
    expect(result).toBe('some text');
  });

  it('should handle eventCode as undefined', () => {
    const result = addOrderStampPrefix(undefined, 'some text');
    expect(result).toBe('some text');
  });

  it('should handle both eventCode and text as undefined', () => {
    const result = addOrderStampPrefix(undefined, undefined);
    expect(result).toBeUndefined();
  });
});


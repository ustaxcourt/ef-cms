const { getCropBox } = require('./getCropBox');

describe('getCropBox', () => {
  let mockCropBoxValue;

  const mockPage = {
    getCropBox: () => mockCropBoxValue,
  };

  it("should return pageHeight, pageWidth, x, and y values from the pages' cropBox", () => {
    mockCropBoxValue = {
      height: 20,
      width: 20,
      x: 15,
      y: 8,
    };

    const result = getCropBox(mockPage);

    expect(result).toEqual({
      pageHeight: mockCropBoxValue.height,
      pageWidth: mockCropBoxValue.width,
      x: mockCropBoxValue.x,
      y: mockCropBoxValue.y,
    });
  });

  it('should default x and y to 0 when they are undefined on the page cropBox', async () => {
    mockCropBoxValue = {
      pageHeight: 20,
      pageWidth: 20,
      x: undefined,
      y: undefined,
    };

    const result = getCropBox(mockPage);

    expect(result).toEqual({
      x: 0,
      y: 0,
    });
  });
});

import { colorPalette } from './color_palette';

describe('colorPalette', () => {
  it('should generate the expected palette', () => {
    const actualPalette = colorPalette('#FFFF6D', '#1EA593');
    expect(actualPalette).toEqual([
      '#ffff6d',
      '#ecf573',
      '#d8eb79',
      '#c4e07d',
      '#b0d682',
      '#9acc86',
      '#84c28a',
      '#6bb98d',
      '#4daf90',
      '#1ea593',
    ]);
  });

  it('should generate a palette with the specified spread', () => {
    const actualPalette = colorPalette('#FFFF6D', '#1EA593', 6);
    expect(actualPalette).toEqual([
      '#ffff6d',
      '#dced77',
      '#b8da80',
      '#92c887',
      '#66b78e',
      '#1ea593',
    ]);
  });
});

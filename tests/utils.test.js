const { generateRandomTransformation, applyTransformationToLetter } = require('../lib/utils');

describe('LetterCraft Utils', () => {
  describe('generateRandomTransformation', () => {
    test('should generate a valid transformation object', () => {
      const transformation = generateRandomTransformation();

      expect(transformation).toHaveProperty('colors');
      expect(transformation).toHaveProperty('rotationRange');
      expect(transformation).toHaveProperty('scaleRange');
      expect(transformation).toHaveProperty('animationType');
      expect(transformation).toHaveProperty('fontSize');
      expect(transformation).toHaveProperty('fontWeight');
      expect(transformation).toHaveProperty('letterSpacing');
      expect(transformation).toHaveProperty('backgroundType');

      expect(Array.isArray(transformation.colors)).toBe(true);
      expect(transformation.colors.length).toBeGreaterThan(0);
      expect(typeof transformation.rotationRange).toBe('number');
      expect(typeof transformation.scaleRange).toBe('number');
      expect(typeof transformation.fontSize).toBe('number');
    });

    test('should have valid animation types', () => {
      const transformation = generateRandomTransformation();
      const validAnimations = ['bounce', 'rotate', 'scale', 'none'];

      expect(validAnimations).toContain(transformation.animationType);
    });
  });

  describe('applyTransformationToLetter', () => {
    test('should return valid CSS properties', () => {
      const transformation = generateRandomTransformation();
      const style = applyTransformationToLetter('A', 0, transformation);

      expect(style).toHaveProperty('color');
      expect(style).toHaveProperty('transform');
      expect(style).toHaveProperty('fontSize');
      expect(style).toHaveProperty('fontWeight');
      expect(style).toHaveProperty('letterSpacing');
      expect(style).toHaveProperty('display');
    });
  });
});


import { TextTransformation } from './types';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate text input
 */
export function validateText(text: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!text || typeof text !== 'string') {
    errors.push({
      field: 'text',
      message: 'Text is required and must be a string',
    });
  } else {
    if (text.length === 0) {
      errors.push({
        field: 'text',
        message: 'Text cannot be empty',
      });
    }

    if (text.length > 100) {
      errors.push({
        field: 'text',
        message: 'Text must be 100 characters or less',
      });
    }

    // Check for potentially harmful content
    if (containsHarmfulContent(text)) {
      errors.push({
        field: 'text',
        message: 'Text contains inappropriate content',
      });
    }
  }

  return errors;
}

/**
 * Validate transformation object
 */
export function validateTransformation(transformation: Partial<TextTransformation>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!transformation) {
    errors.push({
      field: 'transformation',
      message: 'Transformation object is required',
    });
    return errors;
  }

  // Validate colors
  if (transformation.colors) {
    if (!Array.isArray(transformation.colors)) {
      errors.push({
        field: 'transformation.colors',
        message: 'Colors must be an array',
      });
    } else if (transformation.colors.length === 0) {
      errors.push({
        field: 'transformation.colors',
        message: 'At least one color is required',
      });
    } else if (transformation.colors.length > 10) {
      errors.push({
        field: 'transformation.colors',
        message: 'Maximum 10 colors allowed',
      });
    } else {
      transformation.colors.forEach((color, index) => {
        if (!isValidHexColor(color)) {
          errors.push({
            field: `transformation.colors[${index}]`,
            message: 'Invalid hex color format',
          });
        }
      });
    }
  }

  // Validate numeric ranges
  if (transformation.rotationRange !== undefined) {
    if (typeof transformation.rotationRange !== 'number' ||
        transformation.rotationRange < 0 ||
        transformation.rotationRange > 90) {
      errors.push({
        field: 'transformation.rotationRange',
        message: 'Rotation range must be a number between 0 and 90',
      });
    }
  }

  if (transformation.scaleRange !== undefined) {
    if (typeof transformation.scaleRange !== 'number' ||
        transformation.scaleRange < 0 ||
        transformation.scaleRange > 1) {
      errors.push({
        field: 'transformation.scaleRange',
        message: 'Scale range must be a number between 0 and 1',
      });
    }
  }

  if (transformation.fontSize !== undefined) {
    if (typeof transformation.fontSize !== 'number' ||
        transformation.fontSize < 12 ||
        transformation.fontSize > 120) {
      errors.push({
        field: 'transformation.fontSize',
        message: 'Font size must be a number between 12 and 120',
      });
    }
  }

  if (transformation.letterSpacing !== undefined) {
    if (typeof transformation.letterSpacing !== 'number' ||
        transformation.letterSpacing < -5 ||
        transformation.letterSpacing > 20) {
      errors.push({
        field: 'transformation.letterSpacing',
        message: 'Letter spacing must be a number between -5 and 20',
      });
    }
  }

  // Validate enums
  if (transformation.animationType !== undefined) {
    const validAnimations = ['bounce', 'rotate', 'scale', 'pulse', 'glow', 'rainbow', 'none'];
    if (!validAnimations.includes(transformation.animationType)) {
      errors.push({
        field: 'transformation.animationType',
        message: `Animation type must be one of: ${validAnimations.join(', ')}`,
      });
    }
  }

  if (transformation.fontWeight !== undefined) {
    const validWeights = ['normal', 'bold', 'light'];
    if (!validWeights.includes(transformation.fontWeight)) {
      errors.push({
        field: 'transformation.fontWeight',
        message: `Font weight must be one of: ${validWeights.join(', ')}`,
      });
    }
  }

  if (transformation.backgroundType !== undefined) {
    const validTypes = ['solid', 'gradient', 'transparent'];
    if (!validTypes.includes(transformation.backgroundType)) {
      errors.push({
        field: 'transformation.backgroundType',
        message: `Background type must be one of: ${validTypes.join(', ')}`,
      });
    }
  }

  return errors;
}

/**
 * Validate preset data
 */
export function validatePreset(data: {
  name?: string;
  transformations?: Partial<TextTransformation>;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.name !== undefined) {
    if (typeof data.name !== 'string') {
      errors.push({
        field: 'name',
        message: 'Preset name must be a string',
      });
    } else if (data.name.length === 0) {
      errors.push({
        field: 'name',
        message: 'Preset name cannot be empty',
      });
    } else if (data.name.length > 50) {
      errors.push({
        field: 'name',
        message: 'Preset name must be 50 characters or less',
      });
    }
  }

  if (data.transformations) {
    errors.push(...validateTransformation(data.transformations));
  }

  return errors;
}

/**
 * Check if string contains potentially harmful content
 */
function containsHarmfulContent(text: string): boolean {
  // Basic content filtering - in production, use more sophisticated filtering
  const harmfulPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick, onload, etc.
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  return harmfulPatterns.some(pattern => pattern.test(text));
}

/**
 * Validate hex color format
 */
function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validate API request parameters
 */
export function validateAPIRequest(params: Record<string, any>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate common API parameters
  if (params.text) {
    errors.push(...validateText(params.text));
  }

  if (params.transformation) {
    errors.push(...validateTransformation(params.transformation));
  }

  if (params.format && !['png', 'base64', 'svg'].includes(params.format)) {
    errors.push({
      field: 'format',
      message: 'Format must be one of: png, base64, svg',
    });
  }

  if (params.userId && typeof params.userId !== 'string') {
    errors.push({
      field: 'userId',
      message: 'User ID must be a string',
    });
  }

  return errors;
}


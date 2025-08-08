import { createUserSchema, updateUserSchema } from '../User.entity';

describe('User Entity', () => {
  describe('createUserSchema', () => {
    it('should validate valid user data', () => {
      const validData = {
        name: 'John Doe',
        zipCode: '12345',
      };

      const result = createUserSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid ZIP code', () => {
      const invalidData = {
        name: 'John Doe',
        zipCode: 'invalid',
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const invalidData = {
        name: '',
        zipCode: '12345',
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('updateUserSchema', () => {
    it('should validate partial user data', () => {
      const validData = {
        name: 'Jane Doe',
      };

      const result = updateUserSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should allow empty object', () => {
      const validData = {};

      const result = updateUserSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
}); 
import { InMemoryUsersRepository } from '../UsersRepository.memory';
import { User } from '../../../domain/users/User.entity';

describe('InMemoryUsersRepository', () => {
  let repository: InMemoryUsersRepository;

  beforeEach(() => {
    repository = new InMemoryUsersRepository();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const userData = {
        name: 'John Doe',
        zipCode: '10001',
        latitude: 40.7505,
        longitude: -73.9965,
        timezone: 'UTC-5',
      };

      const result = await repository.create(userData);

      expect(result).toMatchObject({
        name: 'John Doe',
        zipCode: '10001',
        latitude: 40.7505,
        longitude: -73.9965,
        timezone: 'UTC-5',
      });
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });
  });

  describe('findById', () => {
    it('should find a user by ID', async () => {
      const userData = {
        name: 'John Doe',
        zipCode: '10001',
        latitude: 40.7505,
        longitude: -73.9965,
        timezone: 'UTC-5',
      };
      const createdUser = await repository.create(userData);

      const result = await repository.findById(createdUser.id);

      expect(result).toEqual(createdUser);
    });

    it('should return null when user not found', async () => {
      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const userData1 = {
        name: 'John Doe',
        zipCode: '10001',
        latitude: 40.7505,
        longitude: -73.9965,
        timezone: 'UTC-5',
      };
      const userData2 = {
        name: 'Jane Smith',
        zipCode: '90210',
        latitude: 34.0901,
        longitude: -118.4065,
        timezone: 'UTC-8',
      };

      await repository.create(userData1);
      await repository.create(userData2);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('John Doe');
      expect(result[1].name).toBe('Jane Smith');
    });

    it('should return empty array when no users exist', async () => {
      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const userData = {
        name: 'John Doe',
        zipCode: '10001',
        latitude: 40.7505,
        longitude: -73.9965,
        timezone: 'UTC-5',
      };
      const createdUser = await repository.create(userData);

      const updateData = {
        name: 'John Updated',
        zipCode: '10002',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'UTC-5',
      };

      const result = await repository.update(createdUser.id, updateData);

      expect(result).toMatchObject({
        id: createdUser.id,
        name: 'John Updated',
        zipCode: '10002',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'UTC-5',
      });
      expect(new Date(result?.updatedAt || '').getTime()).toBeGreaterThanOrEqual(new Date(createdUser.updatedAt).getTime());
    });

    it('should return null when user not found', async () => {
      const result = await repository.update('non-existent-id', { name: 'Updated' });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      const userData = {
        name: 'John Doe',
        zipCode: '10001',
        latitude: 40.7505,
        longitude: -73.9965,
        timezone: 'UTC-5',
      };
      const createdUser = await repository.create(userData);

      const result = await repository.delete(createdUser.id);

      expect(result).toBe(true);

      const deletedUser = await repository.findById(createdUser.id);
      expect(deletedUser).toBeNull();
    });

    it('should return false when user not found', async () => {
      const result = await repository.delete('non-existent-id');

      expect(result).toBe(false);
    });
  });

  describe('utility methods', () => {
    it('should clear all users', async () => {
      await repository.create({
        name: 'John Doe',
        zipCode: '10001',
        latitude: 40.7505,
        longitude: -73.9965,
        timezone: 'UTC-5',
      });

      repository.clear();

      const users = await repository.findAll();
      expect(users).toHaveLength(0);
      expect(repository.getCount()).toBe(0);
    });

    it('should return correct user count', async () => {
      await repository.create({
        name: 'John Doe',
        zipCode: '10001',
        latitude: 40.7505,
        longitude: -73.9965,
        timezone: 'UTC-5',
      });
      await repository.create({
        name: 'Jane Smith',
        zipCode: '90210',
        latitude: 34.0901,
        longitude: -118.4065,
        timezone: 'UTC-8',
      });

      expect(repository.getCount()).toBe(2);
    });
  });
}); 
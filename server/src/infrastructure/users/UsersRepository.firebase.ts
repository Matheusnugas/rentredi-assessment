import { User, CreateUserData, UpdateUserData } from '../../domain/users/User.entity';
import { UsersRepository } from '../../domain/users/UsersRepository.port';
import { getDatabase } from '../firebase/firebaseAdmin';
import logger from '../../shared/logger';

export class FirebaseUsersRepository implements UsersRepository {
  private readonly database = getDatabase();
  private readonly usersRef = this.database.ref('users');

  async create(
    data: CreateUserData & {
      latitude: number;
      longitude: number;
      timezone: string;
    }
  ): Promise<User> {
    const now = new Date().toISOString();

    const userData = {
      name: data.name,
      zipCode: data.zipCode,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const newUserRef = this.usersRef.push();
      const userId = newUserRef.key!;
      
      const user: User = {
        id: userId,
        ...userData,
      };

      await newUserRef.set(userData);
      logger.info({ userId }, 'User created successfully in Firebase');
      return user;
    } catch (error) {
      logger.error({ error }, 'Failed to create user in Firebase');
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const snapshot = await this.usersRef.child(id).once('value');
      const userData = snapshot.val();
      
      if (!userData) {
        return null;
      }

      return {
        id,
        ...userData,
      } as User;
    } catch (error) {
      logger.error({ error, userId: id }, 'Failed to find user in Firebase');
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const snapshot = await this.usersRef.once('value');
      const usersData = snapshot.val();
      
      if (!usersData) {
        return [];
      }

      const users: User[] = Object.entries(usersData).map(([id, userData]) => ({
        id,
        ...(userData as Omit<User, 'id'>),
      })) as User[];
      
      return users;
    } catch (error) {
      logger.error({ error }, 'Failed to find all users in Firebase');
      throw error;
    }
  }

  async update(id: string, data: UpdateUserData): Promise<User | null> {
    try {
      const existingUser = await this.findById(id);
      if (!existingUser) {
        return null;
      }

      const updatedUser: User = {
        ...existingUser,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      await this.usersRef.child(id).update(data);
      logger.info({ userId: id }, 'User updated successfully in Firebase');
      return updatedUser;
    } catch (error) {
      logger.error({ error, userId: id }, 'Failed to update user in Firebase');
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const existingUser = await this.findById(id);
      if (!existingUser) {
        return false;
      }

      await this.usersRef.child(id).remove();
      logger.info({ userId: id }, 'User deleted successfully from Firebase');
      return true;
    } catch (error) {
      logger.error({ error, userId: id }, 'Failed to delete user from Firebase');
      throw error;
    }
  }
} 
import { v4 as uuidv4 } from 'uuid';
import { User, CreateUserData, UpdateUserData } from '../../domain/users/User.entity';
import { UsersRepository } from '../../domain/users/UsersRepository.port';

export class InMemoryUsersRepository implements UsersRepository {
  private users = new Map<string, User>();

  async create(
    data: CreateUserData & {
      latitude: number;
      longitude: number;
      timezone: string;
    }
  ): Promise<User> {
    const now = new Date().toISOString();

    const user: User = {
      id: uuidv4(),
      name: data.name,
      zipCode: data.zipCode,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(user.id, user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    return user || null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async update(id: string, data: UpdateUserData): Promise<User | null> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      return null;
    }

    const updatedUser: User = {
      ...existingUser,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  clear(): void {
    this.users.clear();
  }

  getCount(): number {
    return this.users.size;
  }
} 
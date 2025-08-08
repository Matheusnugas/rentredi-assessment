import { User, CreateUserData, UpdateUserData } from './User.entity';

export interface UsersRepository {
  create(
    data: CreateUserData & {
      latitude: number;
      longitude: number;
      timezone: string;
    }
  ): Promise<User>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, data: UpdateUserData): Promise<User | null>;
  delete(id: string): Promise<boolean>;
} 
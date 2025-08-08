import { User } from '../../domain/users/User.entity';
import { UsersRepository } from '../../domain/users/UsersRepository.port';

export class ListUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(): Promise<User[]> {
    return await this.usersRepository.findAll();
  }
} 
import { User } from '../../domain/users/User.entity';
import { UsersRepository } from '../../domain/users/UsersRepository.port';

export class GetUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(id: string): Promise<User | null> {
    return await this.usersRepository.findById(id);
  }
} 
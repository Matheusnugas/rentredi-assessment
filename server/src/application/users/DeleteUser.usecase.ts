import { UsersRepository } from '../../domain/users/UsersRepository.port';

export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(id: string): Promise<boolean> {
    return await this.usersRepository.delete(id);
  }
} 
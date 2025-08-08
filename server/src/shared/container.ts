import { UsersController } from '../interfaces/http/UsersController';
import { CreateUserUseCase } from '../application/users/CreateUser.usecase';
import { GetUserUseCase } from '../application/users/GetUser.usecase';
import { ListUsersUseCase } from '../application/users/ListUsers.usecase';
import { UpdateUserUseCase } from '../application/users/UpdateUser.usecase';
import { DeleteUserUseCase } from '../application/users/DeleteUser.usecase';
import { FirebaseUsersRepository } from "../infrastructure/users/UsersRepository.firebase";
import { UsersRepository } from "../domain/users/UsersRepository.port";
import { OpenWeatherClient } from "../infrastructure/openweather/OpenWeatherClient";

export class Container {
  private static _instance: Container;

  private _usersRepository: UsersRepository | null = null;
  private _usersController: UsersController | null = null;
  private _openWeatherClient: OpenWeatherClient | null = null;

  public static getInstance(): Container {
    if (!Container._instance) {
      Container._instance = new Container();
    }
    return Container._instance;
  }

  public getUsersRepository(): UsersRepository {
    if (!this._usersRepository) {
      this._usersRepository = new FirebaseUsersRepository();
    }
    return this._usersRepository;
  }

  public getOpenWeatherClient(): OpenWeatherClient {
    if (!this._openWeatherClient) {
      this._openWeatherClient = new OpenWeatherClient();
    }
    return this._openWeatherClient;
  }

  public getUsersController(): UsersController {
    if (!this._usersController) {
      const usersRepository = this.getUsersRepository();
      const openWeatherClient = this.getOpenWeatherClient();

      const createUserUseCase = new CreateUserUseCase(
        usersRepository,
        openWeatherClient
      );
      const getUserUseCase = new GetUserUseCase(usersRepository);
      const listUsersUseCase = new ListUsersUseCase(usersRepository);
      const updateUserUseCase = new UpdateUserUseCase(
        usersRepository,
        openWeatherClient
      );
      const deleteUserUseCase = new DeleteUserUseCase(usersRepository);

      this._usersController = new UsersController(
        createUserUseCase,
        getUserUseCase,
        listUsersUseCase,
        updateUserUseCase,
        deleteUserUseCase
      );
    }
    return this._usersController;
  }
} 
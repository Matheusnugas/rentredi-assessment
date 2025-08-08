import { CreateUserUseCase } from '../CreateUser.usecase';
import { UsersRepository } from '../../../domain/users/UsersRepository.port';
import { OpenWeatherClient } from '../../../infrastructure/openweather/OpenWeatherClient';
import { User } from '../../../domain/users/User.entity';
import { ExternalServiceError } from '../../../shared/http/errorHandler';

const mockUsersRepository: jest.Mocked<UsersRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockOpenWeatherClient: jest.Mocked<OpenWeatherClient> = {
  getByZipCode: jest.fn(),
};

describe("CreateUserUseCase", () => {
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    createUserUseCase = new CreateUserUseCase(
      mockUsersRepository,
      mockOpenWeatherClient
    );
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should create a user with geodata successfully", async () => {
      const userData = {
        name: "John Doe",
        zipCode: "10001",
      };

      const geodata = {
        latitude: 40.7505,
        longitude: -73.9965,
        timezone: "UTC-5",
      };

      const expectedUser: User = {
        id: "user-123",
        name: userData.name,
        zipCode: userData.zipCode,
        latitude: geodata.latitude,
        longitude: geodata.longitude,
        timezone: geodata.timezone,
        createdAt: "2024-01-15T10:30:00.000Z",
        updatedAt: "2024-01-15T10:30:00.000Z",
      };

      mockOpenWeatherClient.getByZipCode.mockResolvedValue(geodata);
      mockUsersRepository.create.mockResolvedValue(expectedUser);

      const result = await createUserUseCase.execute(userData);

      expect(mockOpenWeatherClient.getByZipCode).toHaveBeenCalledWith("10001");
      expect(mockUsersRepository.create).toHaveBeenCalledWith({
        ...userData,
        latitude: geodata.latitude,
        longitude: geodata.longitude,
        timezone: geodata.timezone,
      });
      expect(result).toEqual(expectedUser);
    });

    it("should throw ExternalServiceError when OpenWeather API fails", async () => {
      const userData = {
        name: "John Doe",
        zipCode: "10001",
      };

      mockOpenWeatherClient.getByZipCode.mockRejectedValue(
        new Error("API Error")
      );

      await expect(createUserUseCase.execute(userData)).rejects.toThrow(
        ExternalServiceError
      );
      expect(mockOpenWeatherClient.getByZipCode).toHaveBeenCalledWith("10001");
      expect(mockUsersRepository.create).not.toHaveBeenCalled();
    });

    it("should handle OpenWeather API timeout", async () => {
      const userData = {
        name: "John Doe",
        zipCode: "10001",
      };

      mockOpenWeatherClient.getByZipCode.mockRejectedValue(
        new Error("timeout")
      );

      await expect(createUserUseCase.execute(userData)).rejects.toThrow(
        ExternalServiceError
      );
      expect(mockOpenWeatherClient.getByZipCode).toHaveBeenCalledWith("10001");
      expect(mockUsersRepository.create).not.toHaveBeenCalled();
    });
  });
}); 
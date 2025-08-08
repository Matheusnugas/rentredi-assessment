import { CreateUserUseCase } from '../CreateUser.usecase';
import { InMemoryUsersRepository } from '../../../infrastructure/users/UsersRepository.memory';
import { OpenWeatherClient } from '../../../infrastructure/openweather/OpenWeatherClient';
import { ExternalServiceError } from '../../../shared/http/errorHandler';

jest.mock("axios");
const axios = require("axios");

describe("CreateUserUseCase - Integration", () => {
  let createUserUseCase: CreateUserUseCase;
  let usersRepository: InMemoryUsersRepository;
  let openWeatherClient: OpenWeatherClient;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    openWeatherClient = new OpenWeatherClient();
    createUserUseCase = new CreateUserUseCase(
      usersRepository,
      openWeatherClient
    );

    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should create a user with real repository and mocked OpenWeather", async () => {
      const userData = {
        name: "John Doe",
        zipCode: "10001",
      };

      const mockOpenWeatherResponse = {
        data: {
          coord: {
            lat: 40.7505,
            lon: -73.9965,
          },
          timezone: -18000,
        },
      };

      axios.get.mockResolvedValue(mockOpenWeatherResponse);

      const result = await createUserUseCase.execute(userData);

      expect(result).toMatchObject({
        name: "John Doe",
        zipCode: "10001",
        latitude: 40.7505,
        longitude: -73.9965,
        timezone: "UTC-5",
      });
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();

      const storedUser = await usersRepository.findById(result.id);
      expect(storedUser).toEqual(result);
      expect(usersRepository.getCount()).toBe(1);
    });

    it("should handle OpenWeather API failure without storing user", async () => {
      const userData = {
        name: "John Doe",
        zipCode: "10001",
      };

      axios.get.mockRejectedValue(new Error("API Error"));

      await expect(createUserUseCase.execute(userData)).rejects.toThrow(
        ExternalServiceError
      );

      expect(usersRepository.getCount()).toBe(0);
    });

    it("should create multiple users correctly", async () => {
      const userData1 = { name: "John Doe", zipCode: "10001" };
      const userData2 = { name: "Jane Smith", zipCode: "90210" };

      const mockResponse1 = {
        data: { coord: { lat: 40.7505, lon: -73.9965 }, timezone: -18000 },
      };
      const mockResponse2 = {
        data: { coord: { lat: 34.0901, lon: -118.4065 }, timezone: -28800 },
      };

      axios.get
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);

      const user1 = await createUserUseCase.execute(userData1);
      const user2 = await createUserUseCase.execute(userData2);

      expect(user1.name).toBe("John Doe");
      expect(user1.timezone).toBe("UTC-5");
      expect(user2.name).toBe("Jane Smith");
      expect(user2.timezone).toBe("UTC-8");

      const allUsers = await usersRepository.findAll();
      expect(allUsers).toHaveLength(2);
    });
  });
}); 
import { User, CreateUserData } from "../../domain/users/User.entity";
import { UsersRepository } from "../../domain/users/UsersRepository.port";
import { OpenWeatherClient } from "../../infrastructure/openweather/OpenWeatherClient";
import { ExternalServiceError } from "../../shared/http/errorHandler";
import logger from "../../shared/logger";

export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private openWeatherClient: OpenWeatherClient
  ) {}

  async execute(data: CreateUserData): Promise<User> {
    try {
      const geodata = await this.openWeatherClient.getByZipCode(data.zipCode);
      logger.info(
        { zipCode: data.zipCode, geodata },
        "Successfully fetched geodata for user creation"
      );

      return await this.usersRepository.create({
        ...data,
        latitude: geodata.latitude,
        longitude: geodata.longitude,
        timezone: geodata.timezone,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error(
        { zipCode: data.zipCode, error: errorMessage },
        "Failed to fetch geodata for user creation"
      );
      throw new ExternalServiceError(
        `Unable to fetch location data for ZIP code ${data.zipCode}`,
        "OpenWeather"
      );
    }
  }
}

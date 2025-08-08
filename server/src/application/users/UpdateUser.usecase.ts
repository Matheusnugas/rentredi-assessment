import { User, UpdateUserData } from '../../domain/users/User.entity';
import { UsersRepository } from '../../domain/users/UsersRepository.port';
import { OpenWeatherClient } from "../../infrastructure/openweather/OpenWeatherClient";
import { ExternalServiceError } from "../../shared/http/errorHandler";
import logger from "../../shared/logger";

export class UpdateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private openWeatherClient: OpenWeatherClient
  ) {}

  async execute(id: string, data: UpdateUserData): Promise<User | null> {
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    if (data.zipCode) {
      try {
        const geodata = await this.openWeatherClient.getByZipCode(data.zipCode);
        updateData.latitude = geodata.latitude;
        updateData.longitude = geodata.longitude;
        updateData.timezone = geodata.timezone;
        logger.info(
          { zipCode: data.zipCode, geodata },
          "Successfully updated geodata for user"
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        logger.error(
          { zipCode: data.zipCode, error: errorMessage },
          "Failed to fetch geodata for user update"
        );
        throw new ExternalServiceError(
          `Unable to fetch location data for ZIP code ${data.zipCode}`,
          "OpenWeather"
        );
      }
    }

    return await this.usersRepository.update(id, updateData);
  }
} 
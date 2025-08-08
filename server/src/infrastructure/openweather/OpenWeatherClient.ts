import axios from 'axios';
import { env } from '../../config/env';
import { ExternalServiceError } from '../../shared/http/errorHandler';
import logger from '../../shared/logger';

export interface Geodata {
  latitude: number;
  longitude: number;
  timezone: string;
}

export class OpenWeatherClient {
  async getByZipCode(zipCode: string): Promise<Geodata> {
    try {
      const response = await axios.get(`${env.OPENWEATHER_API_BASE_URL}/weather`, {
        params: {
          zip: `${zipCode},us`,
          appid: env.OPENWEATHER_API_KEY,
        },
        timeout: 5000,
      });

      const geodata = {
        latitude: response.data.coord.lat,
        longitude: response.data.coord.lon,
        timezone: `UTC${response.data.timezone / 3600 >= 0 ? '+' : ''}${Math.floor(response.data.timezone / 3600)}`,
      };
      
      return geodata;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.warn({ zipCode, error: errorMessage }, 'OpenWeather API call failed');
      throw new ExternalServiceError(`Failed to fetch geodata for ZIP ${zipCode}`, 'OpenWeather');
    }
  }
} 
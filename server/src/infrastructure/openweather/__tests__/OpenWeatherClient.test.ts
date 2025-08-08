import { OpenWeatherClient } from '../OpenWeatherClient';
import { ExternalServiceError } from '../../../shared/http/errorHandler';

jest.mock("axios");
const axios = require("axios");

describe("OpenWeatherClient", () => {
  let client: OpenWeatherClient;

  beforeEach(() => {
    client = new OpenWeatherClient();
    jest.clearAllMocks();
  });

  describe("getByZipCode", () => {
    it("should fetch geodata successfully", async () => {
      const zipCode = "10001";
      const mockResponse = {
        data: {
          coord: {
            lat: 40.7505,
            lon: -73.9965,
          },
          timezone: -18000,
        },
      };

      axios.get.mockResolvedValue(mockResponse);

      const result = await client.getByZipCode(zipCode);

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/weather"),
        {
          params: {
            zip: "10001,us",
            appid: expect.any(String),
          },
          timeout: 5000,
        }
      );
      expect(result).toEqual({
        latitude: 40.7505,
        longitude: -73.9965,
        timezone: "UTC-5",
      });
    });

    it("should handle positive timezone offset", async () => {
      const zipCode = "90210";
      const mockResponse = {
        data: {
          coord: {
            lat: 34.0522,
            lon: -118.2437,
          },
          timezone: 28800,
        },
      };

      axios.get.mockResolvedValue(mockResponse);

      const result = await client.getByZipCode(zipCode);

      expect(result.timezone).toBe("UTC+8");
    });

    it("should handle zero timezone offset", async () => {
      const zipCode = "00000";
      const mockResponse = {
        data: {
          coord: {
            lat: 0,
            lon: 0,
          },
          timezone: 0,
        },
      };

      axios.get.mockResolvedValue(mockResponse);

      const result = await client.getByZipCode(zipCode);

      expect(result.timezone).toBe("UTC+0");
    });

    it("should throw ExternalServiceError on API failure", async () => {
      const zipCode = "10001";
      const errorMessage = "API Error";
      axios.get.mockRejectedValue(new Error(errorMessage));

      await expect(client.getByZipCode(zipCode)).rejects.toThrow(
        ExternalServiceError
      );

      try {
        await client.getByZipCode(zipCode);
      } catch (error) {
        expect(error).toBeInstanceOf(ExternalServiceError);
        expect((error as ExternalServiceError).message).toContain(
          "Failed to fetch geodata for ZIP 10001"
        );
      }
    });

    it("should throw ExternalServiceError on timeout", async () => {
      const zipCode = "10001";
      axios.get.mockRejectedValue(new Error("timeout"));

      await expect(client.getByZipCode(zipCode)).rejects.toThrow(
        ExternalServiceError
      );
    });

    it("should handle malformed response data", async () => {
      const zipCode = "10001";
      const mockResponse = {
        data: {},
      };

      axios.get.mockResolvedValue(mockResponse);

      await expect(client.getByZipCode(zipCode)).rejects.toThrow();
    });
  });
}); 
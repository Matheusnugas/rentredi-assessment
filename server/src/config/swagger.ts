import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RentRedi User Management API',
      version: '1.0.0',
      description: 'A production-ready user management API with geodata enrichment from OpenWeather and Firebase Realtime Database persistence.',
      contact: {
        name: 'RentRedi Assessment',
      },
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique user identifier (Firebase push key)',
              example: '-OX7KxhYijw4R-64om8t',
            },
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe',
            },
            zipCode: {
              type: 'string',
              description: 'US ZIP code (5 digits or 5+4 format)',
              example: '10001',
            },
            latitude: {
              type: 'number',
              description: 'Geographic latitude (fetched from OpenWeather)',
              example: 40.7505,
            },
            longitude: {
              type: 'number',
              description: 'Geographic longitude (fetched from OpenWeather)',
              example: -73.9965,
            },
            timezone: {
              type: 'string',
              description: 'Timezone offset (fetched from OpenWeather)',
              example: 'UTC-5',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
              example: '2024-01-15T10:30:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
              example: '2024-01-15T10:30:00.000Z',
            },
          },
          required: ['id', 'name', 'zipCode', 'latitude', 'longitude', 'timezone', 'createdAt', 'updatedAt'],
        },
        CreateUserRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe',
              minLength: 1,
              maxLength: 100,
            },
            zipCode: {
              type: 'string',
              description: 'US ZIP code (5 digits or 5+4 format)',
              example: '10001',
              pattern: '^\\d{5}(-\\d{4})?$',
            },
          },
          required: ['name', 'zipCode'],
        },
        UpdateUserRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe',
              minLength: 1,
              maxLength: 100,
            },
            zipCode: {
              type: 'string',
              description: 'US ZIP code (5 digits or 5+4 format)',
              example: '10001',
              pattern: '^\\d{5}(-\\d{4})?$',
            },
          },
        },
        ApiSuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'User created successfully',
            },
            data: {
              oneOf: [
                { $ref: '#/components/schemas/User' },
                { type: 'array', items: { $ref: '#/components/schemas/User' } },
                { type: 'object' },
              ],
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z',
            },
          },
        },
        ApiErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            code: {
              type: 'string',
              example: 'VALIDATION_ERROR',
            },
            message: {
              type: 'string',
              example: 'Validation failed',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  path: {
                    type: 'string',
                    example: 'zipCode',
                  },
                  message: {
                    type: 'string',
                    example: 'Invalid ZIP code format',
                  },
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z',
            },
          },
        },
      },
      responses: {
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiErrorResponse',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiErrorResponse',
              },
            },
          },
        },
        ExternalServiceError: {
          description: 'External service error (OpenWeather API)',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiErrorResponse',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/interfaces/http/*.ts', './src/domain/users/*.ts'],
};

export const specs = swaggerJsdoc(options); 
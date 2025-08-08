import { Request, Response, NextFunction } from 'express';
import { CreateUserUseCase } from '../../application/users/CreateUser.usecase';
import { GetUserUseCase } from '../../application/users/GetUser.usecase';
import { ListUsersUseCase } from '../../application/users/ListUsers.usecase';
import { UpdateUserUseCase } from '../../application/users/UpdateUser.usecase';
import { DeleteUserUseCase } from '../../application/users/DeleteUser.usecase';
import { NotFoundError } from "../../shared/http/errorHandler";

export class UsersController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getUserUseCase: GetUserUseCase,
    private listUsersUseCase: ListUsersUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase
  ) {}

  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Create a new user
   *     description: Creates a new user with geodata enrichment from OpenWeather API
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserRequest'
   *           example:
   *             name: "John Doe"
   *             zipCode: "10001"
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiSuccessResponse'
   *             example:
   *               success: true
   *               message: "User created successfully"
   *               data:
   *                 id: "-OX7KxhYijw4R-64om8t"
   *                 name: "John Doe"
   *                 zipCode: "10001"
   *                 latitude: 40.7505
   *                 longitude: -73.9965
   *                 timezone: "UTC-5"
   *                 createdAt: "2024-01-15T10:30:00.000Z"
   *                 updatedAt: "2024-01-15T10:30:00.000Z"
   *               timestamp: "2024-01-15T10:30:00.000Z"
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       503:
   *         $ref: '#/components/responses/ExternalServiceError'
   */
  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await this.createUserUseCase.execute(req.body);
      res.success(user, "User created successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: Get a user by ID
   *     description: Retrieves a user by their unique identifier
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID (Firebase push key)
   *         example: "-OX7KxhYijw4R-64om8t"
   *     responses:
   *       200:
   *         description: User retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiSuccessResponse'
   *             example:
   *               success: true
   *               message: "User retrieved successfully"
   *               data:
   *                 id: "-OX7KxhYijw4R-64om8t"
   *                 name: "John Doe"
   *                 zipCode: "10001"
   *                 latitude: 40.7505
   *                 longitude: -73.9965
   *                 timezone: "UTC-5"
   *                 createdAt: "2024-01-15T10:30:00.000Z"
   *                 updatedAt: "2024-01-15T10:30:00.000Z"
   *               timestamp: "2024-01-15T10:30:00.000Z"
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   */
  async getUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.getUserUseCase.execute(id);

      if (!user) {
        throw new NotFoundError("User not found");
      }

      res.success(user, "User retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: List all users
   *     description: Retrieves all users from the database
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: Users retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiSuccessResponse'
   *             example:
   *               success: true
   *               message: "Users retrieved successfully"
   *               data:
   *                 - id: "-OX7KxhYijw4R-64om8t"
   *                   name: "John Doe"
   *                   zipCode: "10001"
   *                   latitude: 40.7505
   *                   longitude: -73.9965
   *                   timezone: "UTC-5"
   *                   createdAt: "2024-01-15T10:30:00.000Z"
   *                   updatedAt: "2024-01-15T10:30:00.000Z"
   *                 - id: "-OX7KxhYijw4R-64om8t2"
   *                   name: "Jane Smith"
   *                   zipCode: "90210"
   *                   latitude: 34.0522
   *                   longitude: -118.2437
   *                   timezone: "UTC-8"
   *                   createdAt: "2024-01-15T11:00:00.000Z"
   *                   updatedAt: "2024-01-15T11:00:00.000Z"
   *               timestamp: "2024-01-15T10:30:00.000Z"
   */
  async listUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await this.listUsersUseCase.execute();
      res.success(users, "Users retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   patch:
   *     summary: Update a user
   *     description: Updates a user's information and re-fetches geodata if zip code changes
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID (Firebase push key)
   *         example: "-OX7KxhYijw4R-64om8t"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateUserRequest'
   *           example:
   *             name: "John Updated"
   *             zipCode: "90210"
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiSuccessResponse'
   *             example:
   *               success: true
   *               message: "User updated successfully"
   *               data:
   *                 id: "-OX7KxhYijw4R-64om8t"
   *                 name: "John Updated"
   *                 zipCode: "90210"
   *                 latitude: 34.0522
   *                 longitude: -118.2437
   *                 timezone: "UTC-8"
   *                 createdAt: "2024-01-15T10:30:00.000Z"
   *                 updatedAt: "2024-01-15T11:00:00.000Z"
   *               timestamp: "2024-01-15T11:00:00.000Z"
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       503:
   *         $ref: '#/components/responses/ExternalServiceError'
   */
  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.updateUserUseCase.execute(id, req.body);

      if (!user) {
        throw new NotFoundError("User not found");
      }

      res.success(user, "User updated successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     summary: Delete a user
   *     description: Deletes a user by their unique identifier
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID (Firebase push key)
   *         example: "-OX7KxhYijw4R-64om8t"
   *     responses:
   *       200:
   *         description: User deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiSuccessResponse'
   *             example:
   *               success: true
   *               message: "User deleted successfully"
   *               data:
   *                 deleted: true
   *               timestamp: "2024-01-15T11:00:00.000Z"
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   */
  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.deleteUserUseCase.execute(id);

      if (!deleted) {
        throw new NotFoundError("User not found");
      }

      res.success({ deleted: true }, "User deleted successfully");
    } catch (error) {
      next(error);
    }
  }
} 
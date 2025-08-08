import { Router } from 'express';
import { Container } from '../../shared/container';
import { validateBody } from '../../shared/http/validation';
import { createUserSchema, updateUserSchema } from '../../domain/users/User.entity';

const router = Router();
const container = Container.getInstance();
const usersController = container.getUsersController();

router.post('/', 
  validateBody(createUserSchema),
  (req, res, next) => usersController.createUser(req, res, next)
);

router.get('/', 
  (req, res, next) => usersController.listUsers(req, res, next)
);

router.get('/:id', 
  (req, res, next) => usersController.getUser(req, res, next)
);

router.patch('/:id', 
  validateBody(updateUserSchema),
  (req, res, next) => usersController.updateUser(req, res, next)
);

router.delete('/:id', 
  (req, res, next) => usersController.deleteUser(req, res, next)
);

export { router as usersRoutes }; 
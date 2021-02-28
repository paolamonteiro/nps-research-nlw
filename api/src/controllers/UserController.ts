import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';

class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;
    const usersRepository = getCustomRepository(UsersRepository);

    // SELECT * FROM USERS WHERE EMAIL = EMAIL
    const userAlreadyExists = await usersRepository.findOne({
      email,
    });

    if (userAlreadyExists) {
      return response.status(400).json({
        error: 'User already exists!',
      });
    }

    const user = usersRepository.create({ name, email });

    await usersRepository.save(user);

    return response.status(201).json(user);
  }

  async getAll(request: Request, response: Response) {
    const usersRepository = getCustomRepository(UsersRepository);

    // SELECT * FROM USERS
    const allUsers = await usersRepository.find();
    return response.json(allUsers);
  }

  async deleteAllUsers(request: Request, response: Response) {
    const usersRepository = getCustomRepository(UsersRepository);

    // SELECT * FROM USERS
    const allUsers = await usersRepository.find();

    // DELETE * FROM USERS
    await usersRepository.remove(allUsers);
    return response.sendStatus(200);
  }
}

export { UserController };

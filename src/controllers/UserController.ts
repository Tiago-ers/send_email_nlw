import chalk from 'chalk';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required('Nome é obrigatório'),
      email: yup.string().email().required('Não é um email válido'),
    });

    // if (!(await schema.isValid(request.body))) {
    //   return response.status(400).json({ error: 'Falha na validação!!!' });
    // }

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      throw new AppError(err);
    }

    //
    const usersRepository = getCustomRepository(UsersRepository);

    // verifica se o email já está cadastrado
    const userExists = await usersRepository.findOne({
      email,
    });

    if (userExists) {
      console.log(chalk.red('usuário já está cadastrado!'));
      throw new AppError('User already exists');
    }

    console.log(chalk.red('Craindo usuário'));
    // cadastra usuário
    const user = usersRepository.create({
      name,
      email,
    });

    await usersRepository.save(user);

    return response.status(201).json(user);
  }
}

export { UserController };

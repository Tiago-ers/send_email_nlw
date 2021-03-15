import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { ServiceRepository } from '../repositories/ServiceRepository';
import { ServiceUsersRepository } from '../repositories/ServiceUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';
import { resolve } from 'path';
import { AppError } from '../errors/AppError';

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, service_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const serviceRepository = getCustomRepository(ServiceRepository);
    const serviceUsersRepository = getCustomRepository(ServiceUsersRepository);

    const userExists = await usersRepository.findOne({ email });

    if (!userExists) throw new AppError('User does not exists');

    const serviceExists = await serviceRepository.findOne({ id: service_id });

    if (!serviceExists) throw new AppError('Service does not exists');

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMails.hbs');

    const serviceUsersExists = await serviceUsersRepository.findOne({
      where: { user_id: userExists.id, value: null },
      relations: ['user', 'service'],
    });

    const variables = {
      name: userExists.name,
      title: serviceExists.title,
      description: serviceExists.description,
      id: '',
      link: process.env.URL_MAIL,
    };

    if (serviceUsersExists) {
      variables.id = serviceUsersExists.id;
      await SendMailService.execute(
        email,
        serviceExists.title,
        variables,
        npsPath
      );
      return response.json(serviceExists);
    }

    //Salvando as informações na tabela service
    const serviceUser = serviceUsersRepository.create({
      user_id: userExists.id,
      service_id,
    });
    await serviceUsersRepository.save(serviceUser);

    // Envia e-mail para o usuário
    variables.id = serviceUser.id;
    await SendMailService.execute(
      email,
      serviceExists.title,
      variables,
      npsPath
    );

    return response.json(serviceUser);
  }
}

export { SendMailController };

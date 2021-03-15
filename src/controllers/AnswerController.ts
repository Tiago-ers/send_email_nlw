import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { ServiceUsersRepository } from '../repositories/ServiceUsersRepository';

class AnswerController {
  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;

    const serviceUsersRepository = getCustomRepository(ServiceUsersRepository);
    const serviceUser = await serviceUsersRepository.findOne({
      id: String(u),
    });

    if (!serviceUser) {
      throw new AppError('Service User does not exists!');
    }

    serviceUser.value = Number(value);

    await serviceUsersRepository.save(serviceUser);

    return response.json(serviceUser);
  }
}

export { AnswerController };

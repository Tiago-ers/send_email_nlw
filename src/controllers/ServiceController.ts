import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { ServiceRepository } from '../repositories/ServiceRepository';

class ServiceController {
  async create(request: Request, response: Response) {
    const { title, description } = request.body;
    const serviceRepository = getCustomRepository(ServiceRepository);

    const service = serviceRepository.create({
      title,
      description,
    });

    await serviceRepository.save(service);
    return response.status(201).json(service);
  }

  async show(request: Request, response: Response) {
    const serviceRepository = getCustomRepository(ServiceRepository);

    const all = await serviceRepository.find();
    return response.json(all);
  }
}

export { ServiceController };

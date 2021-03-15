import { Request, Response } from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';
import { ServiceUsersRepository } from '../repositories/ServiceUsersRepository';

class NpsController {
  async execute(request: Request, response: Response) {
    const { service_id } = request.params;
    const serviceUserRepository = getCustomRepository(ServiceUsersRepository);

    const serviceUser = await serviceUserRepository.find({
      service_id,
      value: Not(IsNull()),
    });

    const detractor = serviceUser.filter(
      (service) => service.value >= 0 && service.value <= 6
    ).length;

    const promoters = serviceUser.filter(
      (service) => service.value >= 9 && service.value <= 10
    ).length;

    const passives = serviceUser.filter(
      (service) => service.value >= 7 && service.value <= 8
    ).length;

    const totalAnswers = serviceUser.length;
    const calculate = Number(
      ((promoters - detractor) / totalAnswers) * 100
    ).toFixed(2);
    return response.json({
      promoters,
      detractor,
      passives,
      totalAnswers,
      nps: calculate,
    });
  }
}

export { NpsController };

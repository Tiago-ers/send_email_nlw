import { EntityRepository, Repository } from 'typeorm';
import { ServiceUser } from '../models/ServiceUser';

@EntityRepository(ServiceUser)
class ServiceUsersRepository extends Repository<ServiceUser> {}

export { ServiceUsersRepository };

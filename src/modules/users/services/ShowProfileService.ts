import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppErrors';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/Users';

interface IRequestDTO {
  user_id: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private UsersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequestDTO): Promise<User> {
    const user = await this.UsersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    return user;
  }
}

export default ShowProfileService;

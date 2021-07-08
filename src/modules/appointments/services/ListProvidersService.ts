import { injectable, inject } from 'tsyringe';
// import AppError from '@shared/errors/AppErrors';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/Users';

interface IRequestDTO {
  user_id?: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private UsersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequestDTO): Promise<User[]> {
    const providers = await this.UsersRepository.findAllProviders({
      except_user_id: user_id,
    });

    return providers;
  }
}

export default ListProvidersService;

import AppError from '@shared/errors/AppErrors';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to return an user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const createdUser = await showProfile.execute({
      user_id: user.id,
    });

    expect(createdUser.name).toBe('John Doe');
    expect(createdUser.email).toBe('johndoe@example.com');
  });

  it('should not be able to return an user with non-existing id', async () => {
    expect(showProfile.execute({ user_id: '12345' })).rejects.toBeInstanceOf(
      AppError,
    );
  });
});

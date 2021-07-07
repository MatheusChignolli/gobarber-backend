import AppError from '@shared/errors/AppErrors';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John John',
      email: 'johndoe@email.com',
    });

    expect(updatedUser.name).toBe('John John');
    expect(updatedUser.email).toBe('johndoe@email.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Thirt',
      email: 'test@test.com',
      password: '1111111',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John John',
        email: 'johndoe@johndoe.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John John',
      email: 'johndoe@email.com',
      password: '654321',
      old_password: '123456',
    });

    const hashedPassword = await fakeHashProvider.generateHash('654321');

    expect(updatedUser.password).toBe(hashedPassword);
  });

  it('should not be able to update password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John John',
        email: 'johndoe@email.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a non-existing user', async () => {
    expect(
      updateProfile.execute({
        user_id: '12345',
        name: 'John John',
        email: 'johndoe@email.com',
        password: '654321',
        old_password: '1111111',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John John',
        email: 'johndoe@email.com',
        password: '654321',
        old_password: '1111111',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

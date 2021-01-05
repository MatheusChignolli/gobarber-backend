import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppErros';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatar from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should be able to upload avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const fileName = 'avatar.jpg';

    const updateUserAvatar = new UpdateUserAvatar(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename: fileName,
    });

    expect(user.avatar).toBe(fileName);
  });

  it('should not be able to upload avatar if user does not exists', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatar(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    await expect(
      updateUserAvatar.execute({
        userId: '123456',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const fileNameOne = 'avatar.jpg';
    const fileNameTwo = 'avatar2.jpg';

    const updateUserAvatar = new UpdateUserAvatar(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename: fileNameOne,
    });

    await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename: fileNameTwo,
    });

    expect(deleteFile).toHaveBeenCalledWith(fileNameOne);
    expect(user.avatar).toBe(fileNameTwo);
  });
});

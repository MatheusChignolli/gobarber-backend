import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { file, user } = req;

    const updateUserAvatarService = container.resolve(UpdateUserAvatarService);

    const updatedUser = await updateUserAvatarService.execute({
      userId: user.id,
      avatarFilename: file.filename,
    });

    delete updatedUser.password;

    return res.json(updatedUser);
  }
}

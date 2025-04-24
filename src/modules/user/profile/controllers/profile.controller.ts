import { Request, Response } from 'express';
import { UserProfileService } from '../services/profile.service';

export class UserProfileController {
    static async getMe(req: Request, res: Response) {
        const userId = req.user!.id;
        const profile = await UserProfileService.getUserProfile(userId);
        res.json(profile);
    }
}

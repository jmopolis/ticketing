import { Request } from 'express';
import jwt from 'jsonwebtoken';

import { UserDoc } from '../models/user';

export const generateJwt = (req: Request, user: UserDoc) => {
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_KEY!
  );

  req.session = {
    jwt: userJwt,
  };
};

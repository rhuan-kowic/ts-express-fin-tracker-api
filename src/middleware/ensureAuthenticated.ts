import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ errorCode: "token.invalid" });
  }

  const [, token] = authToken.split(" ");

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET missing");
    }

    const { sub } = verify(token, secret) as IPayload;

    req.user = {
      id: Number(sub),
    };

    return next();
  } catch (err) {
    return res.status(401).json({ errorCode: "token.expired" });
  }
}

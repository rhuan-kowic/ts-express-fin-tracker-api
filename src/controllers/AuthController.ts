import z from "zod";
import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { compare } from "bcryptjs";

export class AuthController {
  async authenticate(req: Request, res: Response) {
    const authBody = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const { email, password } = authBody.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Email ou senha incorretos." });
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Email ou senha incorretos." });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET não definido no .env");
    }

    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn: "7d",
    });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  }
}

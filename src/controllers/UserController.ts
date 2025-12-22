import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { hash } from "bcryptjs";

export class UserController {
  async create(req: Request, res: Response) {
    const registerBody = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { name, email, password } = registerBody.parse(req.body);

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(409).json({ error: "E-mail já cadastrado." });
    }

    const passwordHash = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
}

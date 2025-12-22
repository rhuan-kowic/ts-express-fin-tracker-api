import { Request, Response } from "express";
import z from "zod";
import { prisma } from "../lib/prisma";

export class CategoryController {
  async create(req: Request, res: Response) {
    const createCategoryBody = z.object({
      name: z.string(),
    });

    const { name } = createCategoryBody.parse(req.body);

    const category = await prisma.category.create({
      data: { name },
    });

    return res.status(201).json(category);
  }

  async list(req: Request, res: Response) {
    const categories = await prisma.category.findMany();
    return res.json(categories);
  }
}

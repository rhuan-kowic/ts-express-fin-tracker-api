import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export class TransactionController {
  async create(req: Request, res: Response) {
    const createTransactionBody = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["income", "expense"]),
      categoryId: z.number(),
    });

    try {
      const { title, amount, type, categoryId } = createTransactionBody.parse(
        req.body
      );

      const transaction = await prisma.transaction.create({
        data: {
          title,
          amount,
          type,
          categoryId,
        },
      });

      return res.status(201).json(transaction);
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Erro ao criar transação, verifique os dados." });
    }
  }

  async list(req: Request, res: Response) {
    const transactions = await prisma.transaction.findMany({
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    const summary = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.income += transaction.amount;
          acc.total += transaction.amount;
        } else {
          acc.expense += transaction.amount;
          acc.total -= transaction.amount;
        }
        return acc;
      },
      { income: 0, expense: 0, total: 0 }
    );

    return res.json({ summary, transactions });
  }

  async delete(req: Request, res: Response) {
    const deleteParams = z.object({
      id: z.string().transform(Number),
    });

    try {
      const { id } = deleteParams.parse(req.params);

      await prisma.transaction.delete({
        where: { id: id },
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(404).json({ error: "Transação não encontrada." });
    }
  }
}

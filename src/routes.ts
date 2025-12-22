import { Router } from "express";
import { CategoryController } from "./controllers/CategoryController";
import { TransactionController } from "./controllers/TransactionController";

const router = Router();
const categoryController = new CategoryController();
const transactionController = new TransactionController();

// Rotas de Categorias
router.post("/categories", categoryController.create);
router.get("/categories", categoryController.list);

// Rotas de Transações
router.post("/transactions", transactionController.create);
router.get("/transactions", transactionController.list);
router.delete("/transactions/:id", transactionController.delete);

export { router };

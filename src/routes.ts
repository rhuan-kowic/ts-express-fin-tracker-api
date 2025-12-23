import { Router } from "express";
import { CategoryController } from "./controllers/CategoryController";
import { TransactionController } from "./controllers/TransactionController";
import { UserController } from "./controllers/UserController";
import { AuthController } from "./controllers/AuthController";

const router = Router();
const categoryController = new CategoryController();
const transactionController = new TransactionController();
const userController = new UserController();
const authController = new AuthController();

// Rotas de Categorias
router.post("/categories", categoryController.create);
router.get("/categories", categoryController.list);

// Rotas de Transações
router.post("/transactions", transactionController.create);
router.get("/transactions", transactionController.list);
router.delete("/transactions/:id", transactionController.delete);

// Rotas de usuarios
router.post("/users", userController.create);

// Rota de Login
router.post("/login", authController.authenticate);

export { router };

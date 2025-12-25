import { Router } from "express";
import { CategoryController } from "./controllers/CategoryController";
import { TransactionController } from "./controllers/TransactionController";
import { UserController } from "./controllers/UserController";
import { AuthController } from "./controllers/AuthController";
import { ensureAuthenticated } from "./middleware/ensureAuthenticated";

const router = Router();
const categoryController = new CategoryController();
const transactionController = new TransactionController();
const userController = new UserController();
const authController = new AuthController();

// Cadastro e Login
router.post("/users", userController.create);
router.post("/login", authController.authenticate);

// Categorias
router.post("/categories", ensureAuthenticated, categoryController.create);
router.get("/categories", ensureAuthenticated, categoryController.list);

// Transações
router.post("/transactions", ensureAuthenticated, transactionController.create);
router.get("/transactions", ensureAuthenticated, transactionController.list);
router.delete(
  "/transactions/:id",
  ensureAuthenticated,
  transactionController.delete
);

export { router };

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Comecando o teste de banco...");
  const categoria = await prisma.category.create({
    data: {
      name: "Lazer",
    },
  });
  console.log("Categoria criada: ", categoria);

  const despesa = await prisma.transaction.create({
    data: {
      title: "CinemaL Homem Aranha",
      amount: 45.5,
      type: "expense",
      categoryId: categoria.id,
    },
  });
  console.log("Transacao vinculada criada: ", despesa);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
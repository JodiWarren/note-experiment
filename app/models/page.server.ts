import type { User, Page } from "@prisma/client";
import invariant from "tiny-invariant";

import { prisma } from "~/db.server";

export type { Page } from "@prisma/client";

export function getPages() {
  return prisma.page.findMany();
}

export function getPage(slug: string) {
  return prisma.page.findFirst({
    where: { slug },
    include: {
      blocks: true,
    },
  });
}

export async function insertBlock(blockId: string, contents: string, pageId: string) {
  const newBlock = await prisma.block.create({
    data: {
      type: "text",
      body: contents,
      pageId,
    },
  });

  const currentPage = await prisma.page.findUnique({
    where: { id: pageId },
    select: { blockOrder: true },
  });

  invariant(currentPage, `Page: ${currentPage} not found`);

  const blockOrder: string[] = JSON.parse(currentPage.blockOrder);
  const blockIndex = blockOrder.findIndex(block => block === blockId);

  const newBlockOrder = [
    ...blockOrder.slice(0, blockIndex),
    newBlock.id,
    ...blockOrder.slice(blockIndex)
  ]

  return prisma.page.update({
    where: { id: pageId },
    data: {
      blockOrder: JSON.stringify(newBlockOrder)
    }
  })
}

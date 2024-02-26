import { Router, Request, Response, NextFunction } from "express";
import Category from "./model";

const router = Router();
/**
 * Fetch all the category list
 */
router.get("/", async (req: Request, res: Response) => {
  const categories = await Category.findAll({
    where: {
      parent_id: null,
    },
    include: [
      {
        model: Category,
        as: "subcategories",
        include: [
          {
            model: Category,
            as: "subcategories",
            include: [
              {
                model: Category,
                as: "subcategories",
              },
            ],
          },
        ],
      },
    ],
  });
  res.status(200).json({ categories: categories });
});

/**
 * Fetch category by id
 */
router.get("/:id", async (req: Request, res: Response) => {
  const category = await Category.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Category,
        as: "subcategories",
        all: true,
      },
    ],
  });
  res.status(200).json({ category });
});

/**
 * Add category item into the category list
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const { parent_id, name } = req.body;
  if (!name) {
    return res
      .status(422)
      .json({ message: "Please indicate the name of category." });
  }

  const exists = await Category.findOne({
    where: {
      name: name,
    },
  });

  if (exists) {
    return res.status(422).json({
      message: `Category with the name ${name} exists in the system.`,
    });
  }

  const category = await Category.create({ parent_id, name });
  return res.status(201).json({ record: category });
});

/**
 * Move or edit category
 */
router.patch("/:id", async (req: Request, res: Response) => {
  const record = await Category.findByPk(req.params.id);
  if (!record) {
    return res
      .status(404)
      .json({ message: "Category record not found in the system." });
  }

  await Category.update(
    {
      id: req.params.id,
    },
    req.body
  );

  return res
    .status(200)
    .json({ message: "Category record updated successfully." });
});

/**
 * Delete category
 */
router.delete("/:id", async (req: Request, res: Response) => {
  const record = await Category.findByPk(req.params.id);
  if (!record) {
    return res
      .status(404)
      .json({ message: "Category record not found in the system." });
  }

  await Category.destroy({
    where: {
      id: req.params.id,
    },
  });

  return res
    .status(200)
    .json({ message: "Category record deleted successfully." });
});

export default router;

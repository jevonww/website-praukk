import type { Request, Response } from "express";
import { ProductService } from "@/services/product.service";
import { Product } from "@/models/product.model";

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  create = async (req: Request, res: Response) => {
    const data = {
      ...req.body,
      price: req.body.price ? parseFloat(req.body.price) : undefined,
      stock: req.body.stock ? parseInt(req.body.stock) : undefined,
      categoryId: req.body.categoryId ? parseInt(req.body.categoryId) : undefined,
      imageUrl: req.file ? `/uploads/products/${req.file.filename}` : undefined,
    };
    const product = await this.productService.create(data);
    res.json({ product });
  };

  list = async (_req: Request, res: Response) => {
    const products = await this.productService.list();
    res.json({ products: products.map((p) => Product.fromRecord(p)) });
  };

  getById = async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    const product = await this.productService.getById(id);
    res.json({ product: Product.fromRecord(product) });
  };

  update = async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    const data = {
      ...req.body,
      price: req.body.price ? parseFloat(req.body.price) : undefined,
      stock: req.body.stock ? parseInt(req.body.stock) : undefined,
      categoryId: req.body.categoryId ? parseInt(req.body.categoryId) : undefined,
      imageUrl: req.file ? `/uploads/products/${req.file.filename}` : undefined,
    };
    const product = await this.productService.update(id, data);
    res.json({ product: Product.fromRecord(product) });
  };

  remove = async (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id), 10);
    await this.productService.remove(id);
    res.json({ ok: true });
  };
}

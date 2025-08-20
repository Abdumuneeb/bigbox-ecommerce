import { NextRequest, NextResponse } from "next/server";
import { Product } from "../models/Product";
import { connectDB } from "../config/db";
import cloudinary from "../config/cloudinary";

// GET all products
export async function getProductsHandler() {
  try {
    await connectDB();

    // ✅ filter products with stock greater than 0
    const products = await Product.find({ stock: { $gt: 0 } });

    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST new product
export async function createProductHandler(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const imageFile = formData.get("image") as File;

    if (!imageFile || typeof imageFile === "string") {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());

    const uploadedImage = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    const { secure_url } = uploadedImage as any;

    const product = await Product.create({
      title,
      description,
      price,
      stock,
      image: secure_url,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ PUT: Update product
export async function updateProductHandler(req: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    await connectDB();

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const imageFile = formData.get("image") as File | null;

    let updateData: any = {
      title,
      description,
      price,
      stock,
    };

    // if new image uploaded, replace
    if (imageFile && typeof imageFile !== "string") {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const uploadedImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      const { secure_url } = uploadedImage as any;
      updateData.image = secure_url;
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Delete product
export async function deleteProductHandler(req: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    await connectDB();
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ GET: Get product by ID + increment views
export const getProductHandler = async (req: NextRequest, { params }: any) => {
  try {
    const { id } = await params;
    await connectDB();

    // ✅ find product and increment views
    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true } // return updated doc with incremented views
    );

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};

export async function getMostPurchasedProductsHandler() {
  try {
    await connectDB();

    // ✅ return products sorted by purchases (desc = most purchased first)
    // ✅ also exclude products with stock = 0 (optional)
    const products = await Product.find({ stock: { $gt: 0 } }).sort({
      purchases: -1,
    }); // -1 = descending, highest purchases first

    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

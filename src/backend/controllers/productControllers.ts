import { NextRequest, NextResponse } from "next/server";
import { Product } from "../models/Product";
import { connectDB } from "../config/db";
import cloudinary from "../config/cloudinary";

// GET all products
export async function getProductsHandler() {
  try {
    await connectDB();
    const products = await Product.find();
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
    const updated = await Product.findByIdAndUpdate(id, await req.json(), {
      new: true,
    });
    return NextResponse.json(updated);
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

// ✅ GET: Get product by ID
export const getProductHandler = async (req: NextRequest, { params }: any) => {
  try {
    const { id } = await params;
    await connectDB();
    const product = await Product.findById(id);

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

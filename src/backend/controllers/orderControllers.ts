import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../config/db";
import { Order } from "../models/Order";
import { Product } from "../models/Product";

// ✅ GET all pending orders
export async function getOrdersHandler(req: NextRequest, { params }: any) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const pendingOrders = await Order.find({
      userId: id,
      status: "pending",
    }).populate("products.productId");

    return NextResponse.json(pendingOrders);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ POST new order (add to order table)
export async function createOrderHandler(req: NextRequest) {
  try {
    await connectDB();
    const { userId, products, totalAmount } = await req.json();
    const { productId } = products[0];

    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: "No products provided" },
        { status: 400 }
      );
    }

    // // ✅ Find the product
    const product = await Product.findById(productId);

    if (product.stock == 0) {
      return NextResponse.json(
        { message: `${product.title} is out of stock` },
        { status: 400 }
      );
    }

    const order = await Order.create({
      userId,
      products,
      totalAmount,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ DELETE order by ID
export async function deleteOrderHandler(req: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    await connectDB();
    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// export async function completeOrdersHandler(req: NextRequest, { params }: any) {
//   try {
//     await connectDB();
//     const { id } = await params;

//     if (!id) {
//       return NextResponse.json(
//         { message: "User ID is required" },
//         { status: 400 }
//       );
//     }

//     const updatedOrders = await Order.updateMany(
//       { userId: id, status: "pending" }, // ✅ match userId field
//       { $set: { status: "completed", completedAt: new Date() } }
//     );

//     return NextResponse.json({
//       message:
//         updatedOrders.modifiedCount > 0
//           ? "Orders updated successfully"
//           : "No pending orders found for this user",
//       updated: updatedOrders,
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { message: error.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

export async function completeOrdersHandler(req: NextRequest, { params }: any) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Find all pending orders for the user
    const pendingOrders = await Order.find({ userId: id, status: "pending" });

    if (pendingOrders.length === 0) {
      return NextResponse.json(
        { message: "No pending orders found for this user" },
        { status: 404 }
      );
    }

    // 2️⃣ For each product in the orders → update purchases & stock
    for (const order of pendingOrders) {
      for (const item of order.products) {
        await Product.findByIdAndUpdate(
          item.productId,
          {
            $inc: {
              purchases: item.quantity, // increase purchase count
              stock: -item.quantity, // decrease stock
            },
          },
          { new: true }
        );
      }
    }

    // 3️⃣ Update all orders to completed
    const updatedOrders = await Order.updateMany(
      { userId: id, status: "pending" },
      { $set: { status: "completed", completedAt: new Date() } }
    );

    return NextResponse.json({
      message:
        updatedOrders.modifiedCount > 0
          ? "Orders completed successfully and products updated"
          : "No pending orders found for this user",
      updated: updatedOrders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

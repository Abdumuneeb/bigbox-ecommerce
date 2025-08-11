import { verifyToken } from "../utils/jwt";
import { NextResponse } from "next/server";

export function withAuth(handler: Function, adminOnly = false) {
  return async (req: any, context: any) => {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
      const decoded = verifyToken(token) as any;
      if (adminOnly && !decoded.isAdmin)
        return NextResponse.json({ message: "Admin only" }, { status: 403 });

      req.user = decoded;
      return handler(req, context);
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  };
}

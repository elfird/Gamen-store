import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, signToken } from "@/lib/auth";

/**
 * Authenticate admin user by email and password.
 */
export async function authenticateAdmin({ email, password }) {
  if (!email || !password) {
    throw new Error("Email dan password wajib diisi.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Find user
  let user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  // If no user exists and it's default admin, bootstrap default admin
  if (!user && (normalizedEmail === "admin@gamenstore.com" || normalizedEmail === "admin@gamen.store")) {
    const hashedPassword = await hashPassword("admin123456");
    user = await prisma.user.create({
      data: {
        name: "Administrator Gamen",
        email: normalizedEmail,
        password: hashedPassword,
        role: "ADMIN",
        active: true,
      },
    });
  }

  if (!user) {
    throw new Error("Email atau password tidak valid.");
  }

  if (!user.active) {
    throw new Error("Akun dinonaktifkan. Hubungi administrator utama.");
  }

  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    throw new Error("Email atau password tidak valid.");
  }

  if (user.role !== "ADMIN" && user.role !== "STAFF") {
    throw new Error("Akses ditolak. Anda tidak memiliki izin admin.");
  }

  // Generate JWT token
  const token = await signToken({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
}

/**
 * Get user profile by ID.
 */
export async function getAdminProfile(userId) {
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });
  return user;
}

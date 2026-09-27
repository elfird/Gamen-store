import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "gamen-store-super-secret-jwt-key-production-ready-2026"
);

export const COOKIE_NAME = "gamen_admin_session";

/**
 * Hash plain text password.
 */
export async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

/**
 * Verify plain text password against hash.
 */
export async function verifyPassword(plainPassword, hashedPassword) {
  if (!plainPassword || !hashedPassword) return false;
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Create a signed JWT token valid for 7 days.
 */
export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

/**
 * Verify and decode a JWT token.
 */
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch {
    return null;
  }
}

/**
 * Get current session from Next.js server context (Server Components & Route Handlers).
 */
export async function getServerSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const session = await verifyToken(token);
    if (!session || !session.userId) return null;
    return session;
  } catch {
    return null;
  }
}

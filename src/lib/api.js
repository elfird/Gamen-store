/**
 * Server-side response helpers for Next.js API routes and Server Actions.
 * Provides consistent shape for all API responses.
 */

import { NextResponse } from "next/server";

/**
 * Create a standardized success response.
 * @param {any} data
 * @param {number} [status=200]
 * @returns {NextResponse}
 */
export function successResponse(data, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * Create a standardized error response.
 * @param {string} message
 * @param {number} [status=400]
 * @param {any} [errors]
 * @returns {NextResponse}
 */
export function errorResponse(message, status = 400, errors = null) {
  return NextResponse.json(
    { success: false, message, ...(errors && { errors }) },
    { status }
  );
}

/**
 * Wrap an API handler with standard error catching.
 * Logs the real error server-side but returns a safe message to the client.
 * @param {Function} handler
 * @returns {Function}
 */
export function withErrorHandler(handler) {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error("[API Error]", error);

      // Prisma unique constraint violation
      if (error.code === "P2002") {
        const field = error.meta?.target?.join(", ") ?? "field";
        return errorResponse(`Nilai ${field} sudah digunakan.`, 409);
      }

      // Prisma record not found
      if (error.code === "P2025") {
        return errorResponse("Data tidak ditemukan.", 404);
      }

      // Prisma foreign key constraint
      if (error.code === "P2003") {
        return errorResponse("Referensi data tidak valid.", 400);
      }

      return errorResponse("Terjadi kesalahan internal.", 500);
    }
  };
}

/**
 * Validate that required fields are present in a request body.
 * Returns an object with { valid: boolean, missing: string[] }.
 * @param {Object} body
 * @param {string[]} requiredFields
 * @returns {{ valid: boolean, missing: string[] }}
 */
export function validateRequiredFields(body, requiredFields) {
  const missing = requiredFields.filter(
    (field) => body[field] === undefined || body[field] === null || body[field] === ""
  );
  return { valid: missing.length === 0, missing };
}

/**
 * Parse pagination query parameters from a URL.
 * @param {URL} url
 * @returns {{ page: number, pageSize: number, skip: number }}
 */
export function parsePagination(url) {
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(url.searchParams.get("pageSize") ?? "20", 10))
  );
  const skip = (page - 1) * pageSize;
  return { page, pageSize, skip };
}

/**
 * Build a Prisma-compatible pagination meta object.
 * @param {number} total
 * @param {number} page
 * @param {number} pageSize
 * @returns {{ total: number, page: number, pageSize: number, totalPages: number, hasNext: boolean, hasPrev: boolean }}
 */
export function buildPaginationMeta(total, page, pageSize) {
  const totalPages = Math.ceil(total / pageSize);
  return {
    total,
    page,
    pageSize,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

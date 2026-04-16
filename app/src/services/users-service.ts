import { db } from "../db";
import { users } from "../db/schema/users";
import { eq } from "drizzle-orm";

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<void> => {
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    throw new ConflictError("Email sudah terdaftar");
  }

  const hashedPassword = await Bun.password.hash(password);

  await db.insert(users).values({ name, email, password: hashedPassword });
};

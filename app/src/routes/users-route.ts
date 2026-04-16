import { Elysia, t } from "elysia";
import { registerUser, ConflictError } from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api/v1/users" }).post(
  "/",
  async ({ body, set }) => {
    try {
      await registerUser(body.name, body.email, body.password);
      return { data: "OK" };
    } catch (err) {
      if (err instanceof ConflictError) {
        set.status = 409;
        return { error: err.message };
      }
      set.status = 500;
      return { error: "Internal server error" };
    }
  },
  {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 8 }),
    }),
  }
);

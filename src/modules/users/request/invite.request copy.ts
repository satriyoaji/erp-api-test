import { ApiError } from "@point-hub/express-error-handler";
import Validatorjs from "validatorjs";

export const validate = (body: any) => {
  const validation = new Validatorjs(body, {
    username: "required",
    email: "required|email",
    password: "required|min:8",
    role_id: "required",
    name: "required",
  });

  if (validation.fails()) {
    throw new ApiError(422, validation.errors.errors);
  }
};

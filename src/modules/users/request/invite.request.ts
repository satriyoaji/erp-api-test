import { ApiError } from "@point-hub/express-error-handler";
import Validatorjs from "validatorjs";

export const validate = (body: any) => {
  const validation = new Validatorjs(body, {
    name: "required",
    email: "required|email",
    role: "required",
  });

  if (validation.fails()) {
    throw new ApiError(422, validation.errors.errors);
  }
};

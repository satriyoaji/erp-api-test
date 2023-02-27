import { jest } from "@jest/globals";
import DbInitCommand from "./index.command.js";

it("test command", () => {
  const dbInitCommand = new DbInitCommand();
  const spy = jest.spyOn(dbInitCommand, "handle");
  dbInitCommand.handle();

  expect(spy).toBeCalled();
});

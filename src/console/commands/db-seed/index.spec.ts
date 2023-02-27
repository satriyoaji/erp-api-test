import { jest } from "@jest/globals";
import SeedCommand from "./index.command.js";

it("test command", () => {
  const seedCommand = new SeedCommand();
  const spy = jest.spyOn(seedCommand, "handle");
  seedCommand.handle();

  expect(spy).toBeCalled();
});

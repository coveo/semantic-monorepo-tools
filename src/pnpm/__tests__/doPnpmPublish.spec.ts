import { spawn } from "node:child_process";
import pnpmPublish from "../doPnpmPublish.js";
import { mockSpawnSuccess } from "../../test-helpers/mockSpawn.js";

jest.mock("node:child_process");
const mockedSpawn = jest.mocked(spawn);

describe("pnpmPublish()", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockSpawnSuccess(mockedSpawn);
  });

  describe("when no options are given", () => {
    it("calls `pnpm publish` without any flags", async () => {
      await pnpmPublish("somepath");

      expect(mockedSpawn).toHaveBeenCalledWith("pnpm", ["publish"], {
        cwd: "somepath",
      });
    });
  });

  describe("when opts.tag is given", () => {
    it("calls `pnpm publish` with the --tag flag", async () => {
      await pnpmPublish("somepath", { tag: "sometag" });

      expect(mockedSpawn).toHaveBeenCalledWith(
        "pnpm",
        ["publish", "--tag", "sometag"],
        { cwd: "somepath" },
      );
    });
  });

  describe("when opts.provenance is set to true", () => {
    it("calls `pnpm publish` with the --provenance flag", async () => {
      await pnpmPublish("somepath", { provenance: true });

      expect(mockedSpawn).toHaveBeenCalledWith(
        "pnpm",
        ["publish", "--provenance"],
        { cwd: "somepath" },
      );
    });
  });

  describe("when opts.provenance is set to false", () => {
    it("calls `pnpm publish` without the --provenance flag", async () => {
      await pnpmPublish("somepath", { provenance: false });

      expect(mockedSpawn).toHaveBeenCalledWith("pnpm", ["publish"], {
        cwd: "somepath",
      });
    });
  });

  describe("when opts.registry is given", () => {
    it("calls `pnpm publish` with the --registry flag", async () => {
      await pnpmPublish("somepath", {
        registry: "https://registry.example.com",
      });

      expect(mockedSpawn).toHaveBeenCalledWith(
        "pnpm",
        ["publish", "--registry", "https://registry.example.com"],
        { cwd: "somepath" },
      );
    });
  });
});

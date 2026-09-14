import { describe, it, expect } from "vitest";
import { isPrivilegedRole, canCreateProject } from "./permissions";
import type { User } from "../types/models";

const buildUser = (role: User["role"]): User => ({
  _id: "user-1",
  firstName: "Test",
  lastName: "User",
  email: "test-user@workspacehub.dev",
  organizationId: "org-1",
  role,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
});

describe("isPrivilegedRole", () => {
  it("treats the owner role as privileged", () => {
    expect(isPrivilegedRole("owner")).toBe(true);
  });

  it("treats the admin role as privileged", () => {
    expect(isPrivilegedRole("admin")).toBe(true);
  });

  it("does not treat the member role as privileged", () => {
    expect(isPrivilegedRole("member")).toBe(false);
  });

  it("does not treat a missing role as privileged", () => {
    expect(isPrivilegedRole(null)).toBe(false);
    expect(isPrivilegedRole(undefined)).toBe(false);
  });
});

describe("canCreateProject", () => {
  it("allows an owner to create a project", () => {
    expect(canCreateProject(buildUser("owner"))).toBe(true);
  });

  it("allows an admin to create a project", () => {
    expect(canCreateProject(buildUser("admin"))).toBe(true);
  });

  it("does not allow a member to create a project", () => {
    expect(canCreateProject(buildUser("member"))).toBe(false);
  });

  it("does not allow project creation when there is no signed-in user", () => {
    expect(canCreateProject(null)).toBe(false);
  });
});

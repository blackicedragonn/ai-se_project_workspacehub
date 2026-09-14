import { describe, it, expect } from "vitest";
import { buildProjectWithTaskCount } from "./projectMetrics";
import type { Project, Task } from "../types/models";

const project: Project = {
  _id: "project-1",
  organizationId: "org-1",
  name: "Website Redesign",
  description: "",
  createdBy: "user-1",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const buildTask = (projectId: string): Task => ({
  _id: `task-${projectId}-${Math.random()}`,
  organizationId: "org-1",
  projectId,
  title: "Some task",
  description: "",
  status: "todo",
  priority: "medium",
  assignedTo: null,
  dueDate: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
});

describe("buildProjectWithTaskCount", () => {
  it("counts only tasks whose projectId matches the project", () => {
    const tasks = [buildTask("project-1"), buildTask("project-1")];

    const result = buildProjectWithTaskCount(project, tasks);

    expect(result.taskCount).toBe(2);
  });

  it("returns a taskCount of zero when there are no tasks at all", () => {
    const result = buildProjectWithTaskCount(project, []);

    expect(result.taskCount).toBe(0);
  });

  it("excludes tasks that belong to a different project", () => {
    const tasks = [
      buildTask("project-1"),
      buildTask("some-other-project"),
      buildTask("some-other-project"),
    ];

    const result = buildProjectWithTaskCount(project, tasks);

    expect(result.taskCount).toBe(1);
  });

  it("preserves the original project fields alongside the new taskCount", () => {
    const result = buildProjectWithTaskCount(project, []);

    expect(result.name).toBe(project.name);
    expect(result._id).toBe(project._id);
  });
});

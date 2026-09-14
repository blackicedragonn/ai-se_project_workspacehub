import type { Project, Task } from "../types/models";

export type ProjectWithTaskCount = Project & {
  taskCount: number;
};

export function buildProjectWithTaskCount(
  project: Project,
  tasks: Task[],
): ProjectWithTaskCount {
  const taskCount = tasks.filter(
    (task) => task.projectId === project._id,
  ).length;

  return {
    ...project,
    taskCount,
  };
}

import { Comment } from "../models/Comment";
import { Task } from "../models/Task";
import type { AuthPayload } from "../types/domain";
import { AppError } from "../utils/appError";
import { assertFound } from "../utils/scopedQuery";
import { requireStringLength } from "../utils/validators";
import { canManageComment } from "./permissionService";

const ensureTaskInOrganization = async (
  taskId: string,
  organizationId: string,
) => {
  const task = await Task.findOne({ _id: taskId, organizationId });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
};

export const listComments = async (organizationId: string, taskId: string) => {
  await ensureTaskInOrganization(taskId, organizationId);
  return Comment.find({ organizationId, taskId }).sort({ createdAt: -1 });
};

export const getCommentById = async (
  organizationId: string,
  taskId: string,
  commentId: string,
) => {
  await ensureTaskInOrganization(taskId, organizationId);
  const comment = await Comment.findOne({
    _id: commentId,
    taskId,
    organizationId,
  });
  return assertFound(comment, "Comment");
};

export const createComment = async (
  actor: AuthPayload,
  taskId: string,
  payload: Record<string, unknown>,
) => {
  await ensureTaskInOrganization(taskId, actor.organizationId);
  const content = requireStringLength(payload.content, "Content", 1);

  return Comment.create({
    organizationId: actor.organizationId,
    taskId,
    authorId: actor.userId,
    content,
  });
};

export const updateComment = async (
  actor: AuthPayload,
  taskId: string,
  commentId: string,
  payload: Record<string, unknown>,
) => {
  const comment = await getCommentById(actor.organizationId, taskId, commentId);

  if (!canManageComment(actor, String(comment.authorId))) {
    throw new AppError(
      "You do not have permission to update this comment",
      403,
    );
  }

  if (payload.content !== undefined) {
    comment.content = requireStringLength(payload.content, "Content", 1);
  }

  await comment.save();
  return comment;
};

export const deleteComment = async (
  actor: AuthPayload,
  taskId: string,
  commentId: string,
) => {
  const comment = await getCommentById(actor.organizationId, taskId, commentId);

  if (!canManageComment(actor, String(comment.authorId))) {
    throw new AppError(
      "You do not have permission to delete this comment",
      403,
    );
  }

  await comment.deleteOne();
  return { deleted: true };
};

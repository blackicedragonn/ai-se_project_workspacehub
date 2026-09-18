import type { Request, Response } from "express";
import {
  createComment,
  deleteComment,
  getCommentById,
  listComments,
  updateComment,
} from "../services/commentService";
import { sendSuccess } from "../utils/apiResponse";

export const listCommentsController = async (req: Request, res: Response) => {
  const { id: taskId } = req.params;
  const comments = await listComments(req.auth!.organizationId, taskId);
  return sendSuccess(res, comments);
};

export const getCommentController = async (req: Request, res: Response) => {
  const { id: taskId, commentId } = req.params;
  const comment = await getCommentById(
    req.auth!.organizationId,
    taskId,
    commentId,
  );
  return sendSuccess(res, comment);
};

export const createCommentController = async (
  req: Request<Record<string, string>, unknown, Record<string, unknown>>,
  res: Response,
) => {
  const { id: taskId } = req.params;
  const comment = await createComment(req.auth!, taskId, req.body);
  return sendSuccess(res, comment, 201);
};

export const updateCommentController = async (
  req: Request<Record<string, string>, unknown, Record<string, unknown>>,
  res: Response,
) => {
  const { id: taskId, commentId } = req.params;
  const comment = await updateComment(req.auth!, taskId, commentId, req.body);
  return sendSuccess(res, comment);
};

export const deleteCommentController = async (req: Request, res: Response) => {
  const { id: taskId, commentId } = req.params;
  const result = await deleteComment(req.auth!, taskId, commentId);
  return sendSuccess(res, result);
};

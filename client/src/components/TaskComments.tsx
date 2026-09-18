import { useMemo, useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { commentService } from "../services/commentService";
import type { Comment, User } from "../types/models";
import { canManageComment } from "../utils/permissions";
import { StatusPanel } from "./StatusPanel";

interface TaskCommentsProps {
  taskId: string;
  users: User[];
}

export const TaskComments = ({ taskId, users }: TaskCommentsProps) => {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [createContent, setCreateContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const usersById = useMemo(
    () => Object.fromEntries(users.map((entry) => [entry._id, entry])),
    [users],
  );

  const resolveAuthorName = (authorId: string) => {
    const author = usersById[authorId];
    return author ? `${author.firstName} ${author.lastName}` : "Unknown user";
  };

  const loadComments = async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const nextComments = await commentService.list(taskId);
      setComments(nextComments);
      setHasLoaded(true);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load comments",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    const nextExpanded = !expanded;
    setExpanded(nextExpanded);

    if (nextExpanded && !hasLoaded) {
      void loadComments();
    }
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError(null);

    try {
      const created = await commentService.create(taskId, {
        content: createContent,
      });
      setComments((current) => [created, ...current]);
      setCreateContent("");
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to create comment",
      );
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
    setActionError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleSaveEdit = async (commentId: string) => {
    setActionError(null);

    try {
      const updated = await commentService.update(taskId, commentId, {
        content: editContent,
      });
      setComments((current) =>
        current.map((comment) =>
          comment._id === commentId ? updated : comment,
        ),
      );
      cancelEdit();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to update comment",
      );
    }
  };

  const handleDelete = async (commentId: string) => {
    setActionError(null);

    try {
      await commentService.delete(taskId, commentId);
      setComments((current) =>
        current.filter((comment) => comment._id !== commentId),
      );
      if (editingId === commentId) {
        cancelEdit();
      }
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to delete comment",
      );
    }
  };

  return (
    <div className="mt-4 border-t border-slate-200 pt-4">
      <button
        className="rounded-[10px] border border-slate-200 px-4 py-2 text-sm font-medium text-ink transition hover:border-slate-300 hover:bg-slate-50 active:opacity-70"
        onClick={handleToggle}
        type="button"
      >
        {expanded ? "Hide Comments" : `Show Comments (${comments.length})`}
      </button>

      {expanded ? (
        <div className="mt-4 space-y-4">
          <form className="space-y-3" onSubmit={handleCreate}>
            <textarea
              className="min-h-20 w-full rounded-2xl border border-slate-200 px-4 py-3 transition hover:border-slate-300 placeholder:text-[#94A3B880]"
              onChange={(event) => setCreateContent(event.target.value)}
              placeholder="Write a comment"
              value={createContent}
            />
            <button
              className="rounded-[10px] bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-80 active:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!createContent.trim()}
              type="submit"
            >
              Add comment
            </button>
          </form>

          {actionError ? (
            <p className="text-sm text-danger">{actionError}</p>
          ) : null}

          {loading ? (
            <StatusPanel
              title="Loading comments"
              message="Fetching comments for this task."
            />
          ) : null}

          {!loading && loadError ? (
            <StatusPanel title="Comments unavailable" message={loadError} />
          ) : null}

          {!loading && !loadError && hasLoaded && comments.length === 0 ? (
            <StatusPanel
              title="No comments"
              message="Be the first to comment on this task."
            />
          ) : null}

          {!loading && !loadError && comments.length > 0 ? (
            <ul className="space-y-3">
              {comments.map((comment) => {
                const canManage = canManageComment(user, comment);
                const isEditing = editingId === comment._id;

                return (
                  <li
                    key={comment._id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-medium text-ink">
                        {resolveAuthorName(comment.authorId)}
                      </p>
                    </div>

                    {isEditing ? (
                      <div className="mt-3 space-y-3">
                        <textarea
                          className="min-h-20 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300"
                          onChange={(event) =>
                            setEditContent(event.target.value)
                          }
                          value={editContent}
                        />
                        <div className="flex flex-wrap gap-3">
                          <button
                            className="rounded-[10px] bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-80 active:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={!editContent.trim()}
                            onClick={() => void handleSaveEdit(comment._id)}
                            type="button"
                          >
                            Save
                          </button>
                          <button
                            className="rounded-[10px] border border-slate-200 px-4 py-2 text-sm font-medium text-ink transition hover:bg-white active:opacity-70"
                            onClick={cancelEdit}
                            type="button"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                        {comment.content}
                      </p>
                    )}

                    {canManage && !isEditing ? (
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button
                          className="rounded-[10px] border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-ink transition hover:border-slate-300 active:opacity-70"
                          onClick={() => startEdit(comment)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-[10px] px-3 py-1.5 text-sm font-normal text-danger transition hover:bg-rose-50 active:opacity-70"
                          onClick={() => void handleDelete(comment._id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

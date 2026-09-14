import type { BookingFormState } from "../pages/BookingsPage";

// Minimum title length is my own choice, not something specified by the
// lesson or mirrored from an existing constraint — the backend Booking
// model and every other model in this project enforce no minlength at all.
const MIN_TITLE_LENGTH = 3;

export const validateBookingFormState = (
  form: BookingFormState,
): string | null => {
  const trimmedTitle = form.title.trim();

  if (!trimmedTitle) {
    return "Title is required.";
  }

  if (trimmedTitle.length < MIN_TITLE_LENGTH) {
    return `Title must be at least ${MIN_TITLE_LENGTH} characters.`;
  }

  if (!form.startsAt) {
    return "Start time is required.";
  }

  const startsAt = new Date(form.startsAt);
  if (Number.isNaN(startsAt.getTime())) {
    return "Start time must be a valid date.";
  }

  if (!form.endsAt) {
    return "End time is required.";
  }

  const endsAt = new Date(form.endsAt);
  if (Number.isNaN(endsAt.getTime())) {
    return "End time must be a valid date.";
  }

  if (endsAt.getTime() <= startsAt.getTime()) {
    return "End time must be after the start time.";
  }

  return null;
};

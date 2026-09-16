import type { BookingFormState } from "../pages/BookingsPage";

// Minimum title length is my own choice, not something specified by the
// lesson or mirrored from an existing constraint — the backend Booking
// model and every other model in this project enforce no minlength at all.
const MIN_TITLE_LENGTH = 3;

export type BookingFormErrors = Partial<Record<keyof BookingFormState, string>>;

export const validateBookingFormState = (
  form: BookingFormState,
): BookingFormErrors => {
  const errors: BookingFormErrors = {};
  const trimmedTitle = form.title.trim();

  if (!trimmedTitle) {
    errors.title = "Title is required.";
  } else if (trimmedTitle.length < MIN_TITLE_LENGTH) {
    errors.title = `Title must be at least ${MIN_TITLE_LENGTH} characters.`;
  }

  let startsAt: Date | null = null;
  if (!form.startsAt) {
    errors.startsAt = "Start time is required.";
  } else {
    startsAt = new Date(form.startsAt);
    if (Number.isNaN(startsAt.getTime())) {
      errors.startsAt = "Start time must be a valid date.";
      startsAt = null;
    }
  }

  let endsAt: Date | null = null;
  if (!form.endsAt) {
    errors.endsAt = "End time is required.";
  } else {
    endsAt = new Date(form.endsAt);
    if (Number.isNaN(endsAt.getTime())) {
      errors.endsAt = "End time must be a valid date.";
      endsAt = null;
    }
  }

  if (startsAt && endsAt && endsAt.getTime() <= startsAt.getTime()) {
    errors.endsAt = "End time must be after the start time.";
  }

  return errors;
};

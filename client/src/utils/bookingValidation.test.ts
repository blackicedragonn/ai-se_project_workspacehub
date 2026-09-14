import { describe, it, expect } from "vitest";
import { validateBookingFormState } from "./bookingValidation";
import type { BookingFormState } from "../pages/BookingsPage";

const validForm: BookingFormState = {
  title: "Team sync",
  description: "",
  startsAt: "2026-06-01T10:00",
  endsAt: "2026-06-01T11:00",
};

describe("validateBookingFormState", () => {
  it("returns an empty object when every field is valid", () => {
    expect(validateBookingFormState(validForm)).toEqual({});
  });

  it("requires a title", () => {
    const result = validateBookingFormState({ ...validForm, title: "" });
    expect(result.title).toBe("Title is required.");
  });

  it("treats a whitespace-only title as missing", () => {
    const result = validateBookingFormState({ ...validForm, title: "   " });
    expect(result.title).toBe("Title is required.");
  });

  it("rejects a title shorter than the minimum length", () => {
    const result = validateBookingFormState({ ...validForm, title: "Hi" });
    expect(result.title).toBe("Title must be at least 3 characters.");
  });

  it("accepts a title exactly at the minimum length", () => {
    const result = validateBookingFormState({ ...validForm, title: "Abc" });
    expect(result).toEqual({});
  });

  it("requires a start time", () => {
    const result = validateBookingFormState({ ...validForm, startsAt: "" });
    expect(result.startsAt).toBe("Start time is required.");
  });

  it("rejects an invalid start time string", () => {
    const result = validateBookingFormState({
      ...validForm,
      startsAt: "not-a-date",
    });
    expect(result.startsAt).toBe("Start time must be a valid date.");
  });

  it("requires an end time", () => {
    const result = validateBookingFormState({ ...validForm, endsAt: "" });
    expect(result.endsAt).toBe("End time is required.");
  });

  it("rejects an invalid end time string", () => {
    const result = validateBookingFormState({
      ...validForm,
      endsAt: "garbage",
    });
    expect(result.endsAt).toBe("End time must be a valid date.");
  });

  it("rejects an end time that is before the start time", () => {
    const result = validateBookingFormState({
      ...validForm,
      startsAt: "2026-06-01T11:00",
      endsAt: "2026-06-01T10:00",
    });
    expect(result.endsAt).toBe("End time must be after the start time.");
  });

  it("rejects an end time that exactly equals the start time (boundary case)", () => {
    const result = validateBookingFormState({
      ...validForm,
      startsAt: "2026-06-01T10:00",
      endsAt: "2026-06-01T10:00",
    });
    expect(result.endsAt).toBe("End time must be after the start time.");
  });

  it("can report multiple field errors at once", () => {
    const result = validateBookingFormState({
      title: "",
      description: "",
      startsAt: "",
      endsAt: "",
    });
    expect(result.title).toBe("Title is required.");
    expect(result.startsAt).toBe("Start time is required.");
    expect(result.endsAt).toBe("End time is required.");
  });
});

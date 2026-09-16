import bcrypt from "bcryptjs";
import { connectToDatabase } from "../config/database";
import { Booking } from "../models/Booking";
import { Comment } from "../models/Comment";
import { Organization } from "../models/Organization";
import { Project } from "../models/Project";
import { Task } from "../models/Task";
import { User } from "../models/User";

const seed = async () => {
  await connectToDatabase();

  await Promise.all([
    Booking.deleteMany({}),
    Comment.deleteMany({}),
    Task.deleteMany({}),
    Project.deleteMany({}),
    User.deleteMany({}),
    Organization.deleteMany({}),
  ]);

  const organization = await Organization.create({
    name: "Acme Studio",
    slug: "acme-studio",
    featureFlags: {
      scheduling: true,
      advancedReports: true,
      customBranding: true,
    },
  });

  const passwordHash = await bcrypt.hash("Password123!", 10);

  const [owner, admin, member] = await User.create([
    {
      firstName: "Olivia",
      lastName: "Owner",
      email: "owner@workspacehub.dev",
      passwordHash,
      organizationId: organization._id,
      role: "owner",
    },
    {
      firstName: "Aiden",
      lastName: "Admin",
      email: "admin@workspacehub.dev",
      passwordHash,
      organizationId: organization._id,
      role: "admin",
    },
    {
      firstName: "Maya",
      lastName: "Member",
      email: "member@workspacehub.dev",
      passwordHash,
      organizationId: organization._id,
      role: "member",
    },
  ]);

  const [projectOne, projectTwo] = await Project.create([
    {
      organizationId: organization._id,
      name: "Platform Refresh",
      description: "Revamp the internal platform dashboard and delivery flow.",
      createdBy: owner._id,
    },
    {
      organizationId: organization._id,
      name: "Customer Portal",
      description:
        "Deliver a lightweight self-service portal for client requests.",
      createdBy: admin._id,
    },
  ]);

  const tasks = await Task.create([
    {
      organizationId: organization._id,
      projectId: projectOne._id,
      title: "Audit current navigation",
      description: "Document current IA issues and stale routes.",
      status: "todo",
      priority: "medium",
      assignedTo: member._id,
      dueDate: new Date("2026-04-08T17:00:00.000Z"),
      createdAt: new Date("2026-04-05T18:00:00.000Z"),
    },
    {
      organizationId: organization._id,
      projectId: projectOne._id,
      title: "Plan migration milestones",
      description: "Define release slices for the dashboard refresh.",
      status: "in_progress",
      priority: "high",
      assignedTo: admin._id,
      dueDate: new Date("2026-04-10T16:00:00.000Z"),
      createdAt: new Date("2026-04-05T17:00:00.000Z"),
    },
    {
      organizationId: organization._id,
      projectId: projectTwo._id,
      title: "Draft portal access rules",
      description: "Capture basic access rules and team approvals.",
      status: "todo",
      priority: "high",
      assignedTo: owner._id,
      dueDate: new Date("2026-04-12T18:00:00.000Z"),
      createdAt: new Date("2026-04-05T16:00:00.000Z"),
    },
    {
      organizationId: organization._id,
      projectId: projectTwo._id,
      title: "Prepare customer FAQ",
      description: "List the first ten questions clients ask most often.",
      status: "done",
      priority: "low",
      assignedTo: member._id,
      dueDate: new Date("2026-04-04T15:00:00.000Z"),
      createdAt: new Date("2026-04-05T15:00:00.000Z"),
    },
    {
      organizationId: organization._id,
      projectId: projectOne._id,
      title: "Review analytics gaps",
      description: "Identify missing data points before report expansion.",
      status: "in_progress",
      priority: "medium",
      assignedTo: owner._id,
      dueDate: new Date("2026-04-15T19:00:00.000Z"),
      createdAt: new Date("2026-04-05T14:00:00.000Z"),
    },
  ]);

  await Comment.create([
    {
      organizationId: organization._id,
      taskId: tasks[0]._id,
      authorId: owner._id,
      content: "Let's start by mapping the stale routes before we redesign.",
    },
    {
      organizationId: organization._id,
      taskId: tasks[0]._id,
      authorId: admin._id,
      content:
        "I can pull last quarter's analytics once the IA audit is ready.",
    },
    {
      organizationId: organization._id,
      taskId: tasks[0]._id,
      authorId: member._id,
      content:
        "I'll take the first pass at documenting navigation gaps tomorrow.",
    },
  ]);

  const departingMember = await User.create({
    firstName: "Nora",
    lastName: "Departed",
    email: "departed@workspacehub.dev",
    passwordHash,
    organizationId: organization._id,
    role: "member",
  });

  await Comment.create({
    organizationId: organization._id,
    taskId: tasks[0]._id,
    authorId: departingMember._id,
    content: "Leaving a note before I rotate off this project.",
  });

  await User.deleteOne({ _id: departingMember._id });

  await Booking.create([
    {
      organizationId: organization._id,
      title: "Sprint planning",
      description: "Weekly team planning block.",
      startsAt: new Date("2026-04-06T14:00:00.000Z"),
      endsAt: new Date("2026-04-06T15:00:00.000Z"),
      createdBy: owner._id,
    },
    {
      organizationId: organization._id,
      title: "Portal review",
      description: "Feature walkthrough with the delivery team.",
      startsAt: new Date("2026-04-06T16:00:00.000Z"),
      endsAt: new Date("2026-04-06T17:00:00.000Z"),
      createdBy: admin._id,
    },
  ]);

  console.log("Seed complete");
  process.exit(0);
};

void seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});

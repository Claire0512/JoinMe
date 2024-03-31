import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    // It is a good idea to set a maximum length for varchars, so that you don't
    // waste space in the database. It is also a good idea to move as much constraints
    // to the database as possible, so that you don't have to worry about them in
    // your application code.
    handle: varchar("handle", { length: 50 }).notNull().unique(),
    // host: varchar("host", { length: 50 }).notNull().unique(),
    displayName: varchar("display_name", { length: 50 }).notNull(),
  },
  (table) => ({
    // indexes are used to speed up queries. Good indexes can make your queries
    // run orders of magnitude faster. learn more about indexes here:
    // https://planetscale.com/learn/courses/mysql-for-developers/indexes/introduction-to-indexes
    handleIndex: index("handle_index").on(table.handle),
    // hostIndex: index("host_index").on(table.host),
  }),
);

export const activitiesTable = pgTable(
  "activities",
  {
    id: serial("id").primaryKey(),
    content: varchar("content", { length: 280 }).notNull(),
    userHandle: varchar("user_handle", { length: 50 })
      .notNull()

      .references(() => usersTable.handle, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    createdAt: timestamp("created_at").default(sql`now()`),
  },
  (table) => ({
    userHandleIndex: index("user_handle_index").on(table.userHandle),
    createdAtIndex: index("created_at_index").on(table.createdAt),
  }),
);

export const attendanceTable = pgTable(
  "attendance",
  {
    id: serial("id").primaryKey(),
    userHandle: varchar("user_handle", { length: 50 })
      .notNull()
      .references(() => usersTable.handle, { onDelete: "cascade" }),
    activityId: integer("activity_id")
      .notNull()
      .references(() => activitiesTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    activityIdIndex: index("activity_id_index").on(table.activityId),
    userHandleIndex: index("user_handle_index").on(table.userHandle),
    // unique constraints ensure that there are no duplicate combinations of
    // values in the table. In this case, we want to ensure that a user can't
    // like the same activity twice.
    uniqCombination: unique().on(table.userHandle, table.activityId),
  }),
);

export const availableTimeTable = pgTable(
  "availableTime",
  {
    id: serial("id").primaryKey(),
    userHandle: varchar("user_handle", { length: 50 })
      .notNull()
      .references(() => usersTable.handle, { onDelete: "cascade" }),
    activityId: integer("eventId")
      .notNull()
      .references(() => activitiesTable.id, { onDelete: "cascade" }),
    time: integer("availableTime").notNull(),
  },
  (table) => ({
    activityIdIndex: index("activityId").on(table.activityId),
    uniqCombination: unique().on(
      table.userHandle,
      table.activityId,
      table.time,
    ),
  }),
);

export const commentsTable = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    content: varchar("content", { length: 280 }).notNull(),
    userHandle: varchar("user_handle", { length: 50 })
      .notNull()
      // this is a foreign key constraint. It ensures that the user_handle
      // column in this table references a valid user_handle in the users table.
      // We can also specify what happens when the referenced row is deleted
      // or updated. In this case, we want to delete the activity if the user
      // is deleted, so we use onDelete: "cascade". It is similar for onUpdate.
      .references(() => usersTable.handle, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    replyToActivityId: integer("reply_to_activity_id"),
    createdAt: timestamp("created_at").default(sql`now()`),
  },
  (table) => ({
    userHandleIndex: index("user_handle_index").on(table.userHandle),
    createdAtIndex: index("created_at_index").on(table.createdAt),
    // we can even set composite indexes, which are indexes on multiple columns
    // learn more about composite indexes here:
    // https://planetscale.com/learn/courses/mysql-for-developers/indexes/composite-indexes
    replyToAndTimeIndex: index("reply_to_time_index").on(
      table.replyToActivityId,
      table.createdAt,
    ),
  }),
);

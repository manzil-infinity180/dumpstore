import mongoose, { Schema, model } from "mongoose";

/**
 * topics and tag should be array but we will take care of it from frontend side
 * May be topics will not be array like -> try it to be in one topic only
 */
interface ICalendar {
  [x: string]: string | Date;
}
export interface IBookMark extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  title: string;
  link: string;
  description?: string;
  tag: string;
  topics?: string; // presently i perfer to go with optional
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  position?: number;
  topics_position?: number;
  user_id: mongoose.Schema.Types.ObjectId;
  calendar?: ICalendar;
}

const calendarSchema = new Schema<ICalendar>(
  {
    summary: String,
    description: String,
    start: Date,
    end: Date,
    kind: String,
    etag: String,
    id: String,
    htmlLink: String,
  },
  {
    _id: false,
  }
);
const bookMarkSchema = new Schema<IBookMark>(
  {
    title: {
      type: String,
      required: [true, "Title is Compulsory"],
    },
    link: {
      type: String,
      required: [true, "Bookmark Link is Essential"],
      // unique: true,
    },
    description: {
      type: String,
    },
    tag: {
      type: String,
      required: [true, "Tag will help to find your Bookmark"],
    },
    topics: {
      type: String, // some default topic and then user will create their own topics
    },
    position: {
      type: Number,
    },
    topics_position: {
      type: Number,
    },
    image: {
      type: String,
    },
    user_id: {
      type: String,
    },
    calendar: {
      type: calendarSchema,
    },
  },
  {
    timestamps: true, // This automatically adds createdAt and updatedAt fields
  }
);

export const Bookmark = model<IBookMark>("Bookmark", bookMarkSchema);

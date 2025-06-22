import dotenv from "dotenv";
dotenv.config();
import { NextFunction, Request, Response } from "express";
import { Bookmark, IBookMark } from "../models/bookmarkModel.js";
import mongoose, { Error } from "mongoose";
import { User } from "../models/userModel.js";
import { UploadImageToCloudinary } from "../utils/UploadImages.js";
// const { google } = require("googleapis");
import * as cheerio from "cheerio";
import { google } from "googleapis";
import {
  ErrorResponse,
  SuccessResponse,
  SuccessResponseWithoutData,
} from "../utils/controllerUtils.js";
const getBookMark = async (req: Request, res: Response) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    SuccessResponse(res, "Bookmark Data Fetched", 200, bookmark);
  } catch (err) {
    ErrorResponse(res, err, 400);
  }
};
const getMyProfile = async (req: Request, res: Response) => {
  try {
    //@ts-expect-error: req.user is not typed
    const user = await User.findById({ _id: req.user._id }).populate("posts");
    SuccessResponse(res, "User Data Fetched", 200, user);
  } catch (err) {
    ErrorResponse(res, err, 400);
  }
};
const createNewBookmark = async (req: Request, res: Response) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { title, link, tag, calendar } = req.body;
    if (!title || !link || !tag) {
      throw new Error("Title, Link, Tag is compulsory fields");
    }
    // TODO : Image Upload Implementation and try to fix the image size(or pixel) before uploading to cloudinary or any other platform
    const domain = new URL(link).hostname;
    if (!process.env.LOGO_FAVICON_URL) throw new Error("Favicon URl is invalid");
    let favicon = process.env.LOGO_FAVICON_URL.replace("<DOMAIN>", domain);
    if (req.body.image?.length > 0) {
      favicon = req.body.image;
    }
    //@ts-expect-error: req.user is not typed
    const user = await User.findById({ _id: req.user._id });
    // TODO : if req.file is existed (manual logo) then you need to omit/override the image
    const bookmarkBody: IBookMark = {
      title,
      link,
      tag,
      image: favicon,
      user_id: user._id, // it should be _id not google/github generated id
      position: user.posts?.length + 1,
      ...req.body,
    };
    const bookmark = await Bookmark.create(bookmarkBody);

    user.posts.push(bookmark._id);

    if (req.body.topics) {
      const result = user.topics.find(
        (el) => req.body.topics.toLowerCase() == el.toLowerCase()
      );
      if (!result) {
        user.topics.push(req.body.topics);
      }
    }
    await user.save();
    SuccessResponse(res, "New Dump Data is Inserted", 200, bookmark);
  } catch (err) {
    ErrorResponse(res, err, 400);
  }
};
/**
 * Getting data now, from Bookmark Model not from User post array
 */
const getAllBookMark = async (req: Request, res: Response) => {
  try {
    //@ts-expect-error: req.user is not typed
    const allBookmark = await Bookmark.find({ user_id: req.user._id });
    SuccessResponse(res, "User all Bookmark Data", 200, allBookmark);
  } catch (err) {
    ErrorResponse(res, err, 400);
  }
};

const getBookmarkByTopic = async (req: Request, res: Response) => {
  try {
    //@ts-expect-error: req.user is not typed
    const user = await User.findById(req.user._id);
    const allBookmark = await Bookmark.find({
      topics: req.body.topics,
      user_id: user._id,
    });
    SuccessResponse(res, "Updated Bookmark Data", 200, allBookmark);
  } catch (err) {
    ErrorResponse(res, err, 400);
  }
};
// const getBookMarkByTags = async (req: Request, res: Response) => {
//   try {
//     //@ts-ignore
//     const allBookmark = await Bookmark.find({ tags: req.body.tags });
//     res.status(200).json({
//       status: "sucess",
//       message: "Updated Bookmark Data",
//       data: allBookmark,
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "failed",
//       message: (err as Error).message,
//     });
//   }
// };
const updateBookmark = async (req: Request, res: Response) => {
  try {
    // const { isChecked, image } = req.body;
    const { isChecked, image, topics } = req.body;
    if (isChecked && isChecked.toLowerCase() === "yes" && image.includes("cloudinary")) {
      const domain = new URL(req.body.link).hostname;
      if (!process.env.LOGO_FAVICON_URL) throw new Error("Favicon URl is invalid");
      const favicon = process.env.LOGO_FAVICON_URL.replace("<DOMAIN>", domain);
      req.body.image = favicon;
    }
    // eslint-disable-next-line
    const Updatebookmark = await Bookmark.findByIdAndUpdate(
      { _id: req.body.id },
      req.body
    );
    // const x = await Bookmark.findById(req.body.id);
    // @ts-expect-error: req.user is not typed
    const user = await User.findById({ _id: req.user._id });
    if (topics !== undefined && topics.length) {
      const result = user.topics.some((el) => {
        return topics.toLowerCase() === el.toLowerCase();
      });
      if (!result) {
        user.topics.push(req.body.topics);
        await user.save();
      }
    }
    SuccessResponseWithoutData(res, "Updated Bookmark Data", 200);
  } catch (err) {
    ErrorResponse(res, err, 400);
  }
};

const updateBookmarkOrder = async (req: Request, res: Response) => {
  const { updatedOrder } = req.body;
  try {
    for (const item of updatedOrder) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id: _, ...rest } = item;
      await Bookmark.findByIdAndUpdate(item._id, rest);
    }
    SuccessResponseWithoutData(res, "Order Successfully Saved", 200);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).send("Failed to update order");
  }
};

const deleteBookmark = async (req: Request, res: Response) => {
  try {
    await Bookmark.findByIdAndDelete(req.params.id);
    // @ts-expect-error: req.user is not typed
    const user = await User.findById({ _id: req.user._id });
    // @ts-expect-error: _id is not typed
    const filterOrder = user.posts.filter((el) => !el._id.equals(req.params.id));
    const newpost: Array<mongoose.Schema.Types.ObjectId> = [];
    // @ts-expect-error: _id is not typed
    filterOrder.map((el) => newpost.push(el._id));
    user.posts = newpost;
    user.save();
    SuccessResponseWithoutData(res, "Deleted Bookmark Data", 200);
  } catch (err) {
    ErrorResponse(res, err, 400);
  }
};
const deleteAllBookmarkByTopics = async (req: Request, res: Response) => {
  try {
    const { topics } = req.body;
    // @ts-expect-error: _id is not typed
    const user = await User.findById(req.user._id);
    await Bookmark.deleteMany({ topics, user_id: user._id });
    // const user = await User.findById({ _id: req.user._id });
    const alltopics = user.topics;
    if (alltopics.length) {
      const filterTopics = alltopics.filter(
        (el) => el.toLowerCase() !== topics.toLowerCase()
      );
      user.topics = filterTopics;
      await user.save();
    }
    SuccessResponseWithoutData(res, "Deleted Bookmark Data", 200);
  } catch (err) {
    ErrorResponse(res, err, 400);
  }
};

const addBookmarkTopic = async (req: Request, res: Response) => {
  try {
    const bookmark = await Bookmark.findById({ _id: req.body.id });
    if (!bookmark) {
      throw new Error("Not found any Bookmark with this data");
    }
    const { topics }: Pick<IBookMark, "topics"> = req.body;
    await Bookmark.findByIdAndUpdate({ _id: req.body.id }, { topics });
    SuccessResponseWithoutData(res, `Added topic ${topics} to bookmark`, 200);
  } catch (err) {
    ErrorResponse(res, err, 400);
  }
};

const uploadBookmarkImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new Error("No file found");
    }
    const result = await UploadImageToCloudinary(req, res, next);
    if (result.length === 0 && !result.secure_url) {
      throw new Error("Failed to Upload Image");
    }
    if (!req.query.id) {
      throw new Error("Something Went Wrong with bookmark id");
    }
    const bookmark = await Bookmark.findById(req.query.id);
    bookmark.image = result.secure_url;
    await bookmark.save();
    // Optional Parameter which i am passing previously - newImage: bookmark.image,
    SuccessResponse(res, "Uploaded Image to Cloudinary", 200, bookmark);
  } catch (err) {
    ErrorResponse(res, err, 400);
  }
};

const uploadImageToCloud = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new Error("No file found");
    }
    const result = await UploadImageToCloudinary(req, res, next);
    if (result.length === 0 && !result.secure_url) {
      throw new Error("Failed to Upload Image");
    }
    const imageUrl = result.secure_url;
    SuccessResponse(res, "Uploaded Image to Cloudinary", 200, { imageUrl });
  } catch (err) {
    ErrorResponse(res, err, 400);
  }
};
export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_CALENDAR
);
const addRemainderToCalendar = async (req: Request, res: Response) => {
  try {
    const { summary, link, endDate, startDate } = req.body;
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const event = {
      summary: summary,
      description: `As you added remainder for this link ${link}`,
      start: {
        dateTime: startDate,
        timeZone: "UTC",
      },
      end: {
        dateTime: endDate,
        timeZone: "UTC",
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 30 }, // Reminder 30 minutes before
          { method: "email", minutes: 60 * 24 }, // Email reminder a day before
        ],
      },
    };
    const result = await calendar.events.insert({
      calendarId: "primary", // Use the primary calendar of the user
      requestBody: event,
    });
    const { kind, etag, id, htmlLink } = result.data;
    res.status(200).json({
      status: "success",
      data: {
        kind,
        etag,
        id,
        htmlLink,
        ...event,
      },
    });
  } catch (err) {
    ErrorResponse(res, err, 400);
  }
};
const updateRemainderToCalendar = async (req: Request, res: Response) => {
  try {
    // bookmarkId - I am getting it from directly from frontend side just for bookmark Query
    const { summary, link, endDate, startDate, eventId, bookmarkId } = req.body;
    if (!eventId) {
      throw new Error("EventId is missing");
    }
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const event = {
      summary: summary,
      description: `As you added remainder for this link ${link}`,
      start: {
        dateTime: startDate,
        timeZone: "UTC",
      },
      end: {
        dateTime: endDate,
        timeZone: "UTC",
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 30 }, // Reminder 30 minutes before
          { method: "email", minutes: 60 * 24 }, // Email reminder a day before
        ],
      },
    };
    const result = await calendar.events.patch({
      calendarId: "primary", // Use the primary calendar of the user
      requestBody: event,
      eventId: eventId,
    });
    const { kind, id, htmlLink } = result.data;
    const calendarData = {
      kind,
      id,
      htmlLink,
      summary,
      description: event.description,
      start: event.start.dateTime,
      end: event.end.dateTime,
    };
    const bookmarkCalendarData = await Bookmark.findById({ _id: bookmarkId });
    bookmarkCalendarData.calendar = calendarData;
    bookmarkCalendarData.save();

    res.status(200).json({
      status: "success",
      data: {
        kind,
        id,
        htmlLink,
        ...event,
      },
      message: "Updated Your Remainder",
    });
  } catch (err) {
    ErrorResponse(res, err, 400);
  }
};

const deleteRemainder = async (req: Request, res: Response) => {
  try {
    // bookmarkId - getting it from frontend side
    const { eventId, bookmarkId } = req.body;
    if (!eventId) {
      throw new Error("EventId is missing");
    }
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    await calendar.events.delete({
      calendarId: "primary", // Use the primary calendar of the user
      eventId: eventId,
    });
    await Bookmark.updateOne(
      { _id: bookmarkId },
      {
        $unset: { calendar: "" },
      }
    );
    SuccessResponseWithoutData(res, "Deleted remainder successfully", 200);
  } catch (err) {
    ErrorResponse(res, err, 400);
  }
};

const searchBookmark = async (req: Request, res: Response) => {
  try {
    const { searchField } = req.body;
    if (!searchField) {
      throw new Error("Invalid Search Field");
    }
    const result: IBookMark[] = await Bookmark.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: searchField,
            // path: ["title", "topics", "tag", "link"],
            fuzzy: { maxEdits: 1, prefixLength: 1, maxExpansions: 256 },
            path: {
              wildcard: "*",
            },
          },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      message: "Search Result",
      length: result.length,
      data: result,
    });
  } catch (err) {
    ErrorResponse(res, err, 400);
  }
};
const getAllChromeBookmark = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      throw new Error("No file received");
    }
    if (file.mimetype != "text/html") {
      throw new Error("Only html files is accepted");
    }
    const fileRead = Buffer.from(req.file.buffer).toString("utf-8");
    if (!fileRead) {
      throw new Error("Getting issues while reading file");
    }
    const $ = cheerio.load(fileRead);
    const user = await User.findById(req.user);
    const bookmarks: Partial<IBookMark>[] = [];
    const position = user.posts.length + 1;
    $("a").each((i, elem) => {
      const title = $(elem).text();
      const link = $(elem).attr("href");
      const domain = new URL(link).hostname;
      if (!process.env.LOGO_FAVICON_URL) throw new Error("Favicon URl is invalid");
      const image = process.env.LOGO_FAVICON_URL.replace("<DOMAIN>", domain);
      const bookmark_object = {
        title,
        link,
        tag: "chrome",
        topics: "chrome",
        image,
        position: position + i,
        topics_position: i,
        user_id: user._id,
      };

      bookmarks.push(bookmark_object);
    });

    const uploadBookmark = await Bookmark.insertMany(bookmarks);
    if (!uploadBookmark) {
      throw new Error("Getting issue while uploading to database");
    }
    const result = user.topics.find((el) => "chrome".toLowerCase() == el.toLowerCase());
    if (!result) {
      user.topics.push("chrome");
    }
    await user.save();

    res.status(200).json({
      status: "success",
      message: "All bookmark fetched",
      totalBookmarkInserted: uploadBookmark.length,
      // allBookmark: bookmarks,
    });
  } catch (err) {
    ErrorResponse(res, err, 400);
  }
};

const getAllChromeBookmarkFromExtension = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user);

    const { allbookmark } = req.body;
    const uploadBookmark = await Bookmark.insertMany(allbookmark as Partial<IBookMark>[]);
    const result = user.topics.find((el) => "chrome".toLowerCase() == el.toLowerCase());
    if (!result) {
      user.topics.push("chrome");
    }
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Uploaded bro",
      totalBookmarkInserted: uploadBookmark.length,
      // allBookmark: bookmarks,
    });
  } catch (err) {
    ErrorResponse(res, err, 400);
  }
};
// TODO : get bookmark by topic and set default as all
// TODO : on selecting on any  tag fetch the data only for tag (get data by tag)

export {
  createNewBookmark,
  updateBookmark,
  deleteBookmark,
  addBookmarkTopic,
  uploadBookmarkImage,
  getAllBookMark,
  getBookMark,
  getBookmarkByTopic,
  getMyProfile,
  searchBookmark,
  deleteAllBookmarkByTopics,
  uploadImageToCloud,
  updateBookmarkOrder,
  getAllChromeBookmark,
  addRemainderToCalendar,
  updateRemainderToCalendar,
  deleteRemainder,
  getAllChromeBookmarkFromExtension,
};

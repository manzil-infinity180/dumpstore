import { QueryClient } from "@tanstack/react-query";
import { NavigateFunction } from "react-router-dom";
import { IRemaindar } from "../EditBookMark/UpdateBookmark";
import toast from "react-hot-toast";
export const queryclient = new QueryClient();
const server = "http://localhost:3008";
class APIError extends Error {
  status: number;
  info: string;

  constructor(message: string, status: number, info: string) {
    super(message);
    this.status = status;
    this.info = info;

    Object.setPrototypeOf(this, APIError.prototype);
  }
}
export interface IBookMark extends Document {
  title: string;
  link: string;
  description?: string;
  tag: string;
  topics?: string; // presently i perfer to go with optional
  image?: string;
}
export interface IResponse {
  message: string;
  status: string;
  data: object;
}
export async function createBookmark(post: {
  [k: string]: FormDataEntryValue;
}) {
  console.log("hello Rahul -----------")
  console.log(post);
  const filterData = post;
  if (post?.calendar && typeof post.calendar === 'string') {
    const filteredCalendar = JSON.parse(post.calendar);
    console.log(filteredCalendar);
    filterData.calendar = filteredCalendar
    console.log(filterData);
  } else {
    console.error('post.calendar is not a string');
  }
  const url = `${server}/api/create-bookmark`;
  // console.log(JSON.stringify(post));
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(filterData),
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
  });
  // console.log(res);
  if (!res.ok) {
    const info = await res.json();
    const error = new APIError(
      "An error occurred while fetching the events",
      res.status,
      info
    );
    throw error;
  }
  const { data }: { data: IResponse } = await res.json();
  console.log(data);

  return data;
}

export async function updateBookmark(post: {
  [k: string]: FormDataEntryValue;
}) {
  console.log(post);
  const filterData = post;
  if (post?.calendar && typeof post.calendar === 'string') {
    const filteredCalendar = JSON.parse(post.calendar);
    console.log(filteredCalendar);
    filterData.calendar = filteredCalendar
    console.log(filterData);
  } else {
    console.error('post.calendar is not a string');
  }
  const url = `${server}/api/update-bookmark`;
  // console.log(JSON.stringify(post));
  const res = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(filterData),
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
  });
  // console.log(res);
  if (!res.ok) {
    const info = await res.json();
    const error = new APIError(
      info.message,
      res.status,
      info
    );
    throw error;
  }
  const data = await res.json();
  console.log(data);

  return data;
}
export async function getBookMark(bookmarkID: string) {
  console.log(bookmarkID);
  const url = `${server}/api/get-bookmark/${bookmarkID}`;
  // console.log(JSON.stringify(post));
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
  });
  // console.log(res);
  if (!res.ok) {
    const info = await res.json();
    const error = new APIError(
      "An error occurred while fetching the events",
      res.status,
      info
    );
    throw error;
  }
  const { data } = await res.json();
  console.log(data);
  return data;
}
export async function getAllBookmark() {
  const url = `${server}/api/get-all-bookmark`;
  // console.log(JSON.stringify(post));
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
  });
  // console.log(res);
  if (!res.ok) {
    const info = await res.json();
    const error = new APIError(
      "An error occurred while fetching the events",
      res.status,
      info
    );
    throw error;
  }
  const { data } = await res.json();
  console.log(data);
  return data;
}
export async function getMyProfile(navigate: NavigateFunction) {
  const url = `${server}/api/get-my-profile`;
  // console.log(JSON.stringify(post));
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
  });
  // console.log(res);
  if (!res.ok) {
    const info = await res.json();
    const error = new APIError(
      "An error occurred while fetching the events",
      res.status,
      info
    );
    navigate("/home");
    throw error;
  }
  const { data } = await res.json();
  console.log(data);
  // navigate('/')
  return data;
}
export async function getBookMarkByTopic(post: string) {
  const url = `${server}/api/get-bookmark-by-topics`;
  console.log(post);
  // console.log(JSON.stringify(post));
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ topics: post }),
    headers: {
      "Content-type": "application/json",
    },
  });
  // console.log(res);
  if (!res.ok) {
    const info = await res.json();
    const error = new APIError(
      "An error occurred while fetching the events",
      res.status,
      info
    );
    throw error;
  }
  const { data } = await res.json();
  console.log(data);
  return data;
}
interface IOrder {
  _id: string;
  [x: string]: string | number;
}
export async function saveBookmarkOrder(reorderedData: IOrder[]) {
  const url = `${server}/api/save-order`;
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ updatedOrder: reorderedData }),
  });

  if (!res.ok) {
    const info = await res.json();
    const error = new APIError(
      "An error occurred while fetching the events",
      res.status,
      info
    );
    throw error;
  }
  const data = await res.json();
  return data;
}

export async function generateTagAndDescription(post: string) {
  const url = `${server}/ai/get-tags-summary-gemini`;
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: post }),
  });

  if (!res.ok) {
    const info = await res.json();
    const error = new APIError(
      "An error occurred while fetching the events",
      res.status,
      info
    );
    throw error;
  }
  const { data } = await res.json();
  return data;
}

export async function getBookmarkFromSearch(post: {
  [k: string]: FormDataEntryValue;
}) {
  const url = `${server}/api/search-bookmark`;
  console.log(post);
  // console.log(JSON.stringify(post));
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(post),
    headers: {
      "Content-type": "application/json",
    },
  });
  // console.log(res);
  if (!res.ok) {
    const info = await res.json();
    const error = new APIError(
      "An error occurred while fetching the events",
      res.status,
      info
    );
    throw error;
  }
  const { data } = await res.json();
  console.log(data);
  return data;
}

export async function logout(navigate: NavigateFunction) {
  const url = `${server}/api/logout`;
  // console.log(JSON.stringify(post));
  const res = await fetch(url, {
    credentials: "include",
  });
  // console.log(res);
  if (!res.ok) {
    const info = await res.json();
    const error = new APIError(
      "An error occurred while fetching the events",
      res.status,
      info
    );
    throw error;
  }
  await res.json();
  navigate("/login");
}

export async function deleteBookmark(bookmarkID: string) {
  console.log(bookmarkID);
  const url = `${server}/api/delete-bookmark/${bookmarkID}`;
  // console.log(JSON.stringify(post));
  const res = await fetch(url, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
  });
  // console.log(res);
  if (!res.ok) {
    const info = await res.json();
    const error = new APIError(
      "An error occurred while fetching the events",
      res.status,
      info
    );
    throw error;
  }
  const data = await res.json();
  console.log(data);
  return data;
}
export async function deleteAllBookmarkByTopics(topics: string) {
  const url = `${server}/api/delete-bookmark-by-topics`;
  // console.log(JSON.stringify(post));
  const res = await fetch(url, {
    method: "DELETE",
    body: JSON.stringify({ topics }),
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
  });
  // console.log(res);
  if (!res.ok) {
    const info = await res.json();
    const error = new APIError(
      "An error occurred while fetching the events",
      res.status,
      info
    );
    throw error;
  }
  const data = await res.json();
  console.log(data);
  return data;
}

export async function uploadImageToCloud(post: FormData) {
  console.log(post);
  console.log([...post.entries()]);
  const url = `${server}/api/upload-image-to-cloud`;
  // console.log(JSON.stringify(post));
  const res = await fetch(url, {
    method: "POST",
    body: post,
    credentials: "include",
  });
  // console.log(res);
  if (!res.ok) {
    const info = await res.json();
    const error = new APIError(
      "An error occurred while fetching the events",
      res.status,
      info
    );
    throw error;
  }
  const { data } = await res.json();
  console.log(data);
  return data;
}

export async function addRemainder(post :  IRemaindar) {
  const url = `${server}/api/calendar`;
  console.log(JSON.stringify(post));
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(post),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  // console.log(res);
  if (!res.ok) {
    const info = await res.json();
    console.log(info);
    if(info.message.includes("No access, refresh token")){
      window.open(`http://localhost:3008/auth/google`, "_self")
    }
    const error = new APIError(
      "An error occurred while fetching the events",
      res.status,
      info
    );
    throw error;
  }
  const { data } = await res.json();
  console.log(data);
  return data;
}
export async function updateRemainder(post :  IRemaindar) {
  const url = `${server}/api/calendar/edit`;
  console.log(JSON.stringify(post));
  const res = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(post),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  // console.log(res);
  if (!res.ok) {
    const info = await res.json();
    console.log(info);
    if(info.message.includes("No access, refresh token")){
      toast.error("Redirecting for authentication")
      window.open(`http://localhost:3008/auth/google`, "_self")
    }
    const error = new APIError(
      info.message,
      res.status,
      info
    );
    throw error;
  }
  const { data } = await res.json();
  console.log(data);
  return data;
}
export async function deleteRemainder(post :  {eventId: string, bookmarkId: string}) {
  const url = `${server}/api/calendar/delete`;
  console.log(JSON.stringify(post));
  const res = await fetch(url, {
    method: "DELETE",
    body: JSON.stringify(post),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  // console.log(res);
  if (!res.ok) {
    const info = await res.json();
    console.log(info);
    toast.error("Redirecting for authentication");
    if(info.message.includes("No access, refresh token")){
      window.open(`http://localhost:3008/auth/google`, "_self")
    }
    
    const error = new APIError(
      "An error occurred while fetching the events",
      res.status,
      info
    );
    throw error;
  }
  const { data } = await res.json();
  console.log(data);
  return data;
}
export async function uploadBookmarkFile(post: FormData) {
  console.log(post);
  console.log([...post.entries()]);
  const url = `${server}/api/upload-all-chrome-bookmark`;
  // console.log(JSON.stringify(post));
  const res = await fetch(url, {
    method: "POST",
    body: post,
    credentials: "include",
  });
  // console.log(res);
  if (!res.ok) {
    const info = await res.json();
    console.log(info);
    const error = new APIError(info.message, res.status, info);
    throw error;
  }
  const data = await res.json();
  console.log(data);
  return data;
}
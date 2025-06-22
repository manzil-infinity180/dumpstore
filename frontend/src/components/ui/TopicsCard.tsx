import React, { SetStateAction } from "react";
import { useMutation } from "@tanstack/react-query";
import { MdDeleteForever } from "react-icons/md";
import { FaTag } from "react-icons/fa";
import {
  deleteAllBookmarkByTopics,
  getBookMarkByTopic,
  queryclient,
} from "../utils/http";
import { type IBookMark, type TtopicsOrder } from "../AllBookMark";

interface ITopicsCard {
  topics: string;
  setBookmark: React.Dispatch<SetStateAction<IBookMark[]>>;
  setManageTopicsOrder: React.Dispatch<SetStateAction<TtopicsOrder>>;
}

function TopicsCard({
  topics,
  setBookmark,
  setManageTopicsOrder,
}: ITopicsCard) {
  const { mutate } = useMutation({
    mutationFn: getBookMarkByTopic,
    onSuccess: () => {
      console.log("Bookmarks fetched successfully");
    },
    onSettled: (data) => {
      data.sort((a: IBookMark, b: IBookMark) => {
        if (
          a.topics_position !== undefined &&
          b.topics_position !== undefined
        ) {
          return a.topics_position - b.topics_position;
        } else if (a.position !== undefined && b.position !== undefined) {
          return a.position - b.position;
        } else {
          return 0;
        }
      });
      setBookmark(data);
      setManageTopicsOrder("topics");
    },
  });

  const { mutate: deleteAllTopicsMutate } = useMutation({
    mutationFn: deleteAllBookmarkByTopics,
    onSuccess: () => {
      console.log("Topic and related bookmarks deleted successfully");
    },
    onSettled: () => {
      queryclient.invalidateQueries();
    },
  });

  function handleFunction(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.closest(".delete-btn")) {
      e.stopPropagation();
      const value = confirm(
        "Are you really want to delete this whole bookmark?"
      );
      if (value) {
        deleteAllTopicsMutate(topics);
      }
      return;
    }
    mutate(topics);
  }

  return (
    <>
      {topics && (
        <div
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer mb-2 overflow-y-auto"
          onClick={handleFunction}
        >
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center space-x-2 flex-grow">
              <FaTag className="text-blue-500" />
              <h3 className="text-gray-800">{topics}</h3>
            </div>
            <button
              className="delete-btn text-red-500 hover:text-red-700 transition-colors duration-300 p-1 rounded-full hover:bg-red-100"
              // onClick={(e) => e.stopPropagation()}
            >
              <MdDeleteForever size={25} className="delete-btn" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default TopicsCard;

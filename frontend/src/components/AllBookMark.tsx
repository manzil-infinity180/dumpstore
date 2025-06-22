import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { GrAddCircle } from "react-icons/gr";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import toast from "react-hot-toast";

import Navbar from "./ui/Navbar";
import SearchField from "./ui/SearchField";
import TopicsCard from "./ui/TopicsCard";
import Loader from "./utils/Loader";
import _BookmarkCard from "./ui/BookmarkCard";
import { getAllBookmark, saveBookmarkOrder, queryclient } from "./utils/http";
import { useProfileData } from "./utils/useProfileData";

export interface IBookMark {
  _id: string;
  title: string;
  link: string;
  tag: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
  topics?: string;
  position?: number;
  topics_position?: number;
  description?: string;
}
export const Bookmark =
  _BookmarkCard as unknown as React.JSXElementConstructor<{
    data: IBookMark;
    uploadDisableBtn: boolean;
  }>;
export type TtopicsOrder = "all" | "topics";

function AllBookMark() {
  const [bookmark, setBookmark] = useState<IBookMark[]>([]);
  const [, setActiveItem] = useState<IBookMark | undefined>();
  const [orderState, setOrderstate] = useState(false);
  const [uploadDisableBtn, setUploadDisableBtn] = useState(false);
  const [manageTopicsOrder, setManageTopicsOrder] =
    useState<TtopicsOrder>("all");

  const navigate = useNavigate();
  const profileData = useProfileData();

  const { data, refetch } = useQuery({
    queryKey: ["all-bookmark"],
    queryFn: async () => {
      const data = await getAllBookmark();
      data.sort(
        (a: IBookMark, b: IBookMark) => (a.position ?? 0) - (b.position ?? 0)
      );
      setBookmark(data);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor)
  );

  const { mutate } = useMutation({
    mutationFn: saveBookmarkOrder,
    onSuccess: () => {
      setUploadDisableBtn(false);
      toast.success("Order Updated!");
    },
    onSettled: () => {
      queryclient.invalidateQueries({ queryKey: ["all-bookmark"] });
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveItem(bookmark.find((b) => b._id === active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeItem = bookmark.find((item) => item._id === active.id);
    const overItem = bookmark.find((item) => item._id === over.id);

    if (!activeItem || !overItem) return;

    const activeIndex = bookmark.findIndex((item) => item._id === active.id);
    const overIndex = bookmark.findIndex((item) => item._id === over.id);

    if (activeIndex !== overIndex) {
      const newItems = arrayMove(bookmark, activeIndex, overIndex);
      setBookmark(newItems);
      setOrderstate(true);
    }

    setActiveItem(undefined);
  };

  const saveOrder = async () => {
    const value = manageTopicsOrder === "all" ? "position" : "topics_position";
    const reorderedData = bookmark.map((item, index) => ({
      _id: item._id,
      [value]: index,
    }));
    mutate(reorderedData);
    setOrderstate(false);
    setUploadDisableBtn(true);
  };

  return (
    <div className="min-h-screen bg-gray-100" style={{backgroundImage: 'radial-gradient(#cbd5e0 1.20px, transparent 1px)', backgroundSize: '20px 20px'}}>
      <Navbar login={true} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <SearchField setBookmark={setBookmark} />
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-bold mb-4 text-center">TOPICS</h3>
            <button
              onClick={() => navigate("/create")}
              className="w-full bg-blue-500 text-white rounded-md py-2 px-4 mb-4 flex items-center justify-start hover:bg-blue-600 transition duration-300"
            >
              <GrAddCircle className="mr-2" />
              Add New Bookmark
            </button>
            <button
              onClick={() => navigate("/upload/bookmark")}
              className="w-full bg-green-500 text-white rounded-md py-2 px-4 mb-4 flex items-center justify-start hover:bg-green-600 transition duration-300"
            >
              <GrAddCircle className="mr-2" />
              Import Bookmark Data
            </button>
            <button
              onClick={() => {
                setManageTopicsOrder("all");
                refetch();
              }}
              className="w-full bg-red-500 text-white rounded-md py-2 px-4 mb-4 hover:bg-red-600 transition duration-300"
            >
              Reset
            </button>
            {profileData?.topics?.map((el) => (
              <TopicsCard
                key={el}
                topics={el}
                setBookmark={setBookmark}
                setManageTopicsOrder={setManageTopicsOrder}
              />
            ))}
          </aside>
          <main className="flex-1">
            <button
              onClick={saveOrder}
              disabled={!orderState}
              className={`mb-4 px-6 py-2 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600 transition duration-300 ${
                !orderState && "opacity-50 cursor-not-allowed"
              }`}
            >
              Save Order
            </button>
            {data ? (
              <div className={`${uploadDisableBtn && "opacity-50"} relative`}>
                {uploadDisableBtn && <Loader />}
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={bookmark.map((b) => ({ id: b._id }))}
                    strategy={rectSortingStrategy}
                  >
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" style={{backgroundImage: 'radial-gradient(#cbd5e0 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
                      {bookmark.map((el) => (
                        <Bookmark
                          key={el._id}
                          data={el}
                          uploadDisableBtn={uploadDisableBtn}
                        />
                      ))}
                      <div
                        className="flex items-center justify-center bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition duration-300"
                        onClick={() => navigate("/create")}
                      >
                        <GrAddCircle className="text-5xl text-gray-400" />
                      </div>
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            ) : (
              <Loader />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AllBookMark;

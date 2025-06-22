import { useMutation } from "@tanstack/react-query";
import React, { SetStateAction, useState } from "react";
import { getBookmarkFromSearch } from "../utils/http";
import { IBookMark } from "../AllBookMark";
import toast from "react-hot-toast";
interface ISearchField {
  setBookmark: React.Dispatch<SetStateAction<IBookMark[]>>;
}
function SearchField({ setBookmark }: ISearchField) {
  const [searchField, setSearchField] = useState<string>("");
  const { mutate } = useMutation({
    mutationFn: getBookmarkFromSearch,
    onSuccess: () => {
      console.log("hello");
    },
    onSettled: (data) => {
      console.log("settled");
      if (data.length === 0) {
        toast.success("No data available");
        setSearchField("");
        return;
      }
      setBookmark(data);
      toast.success(`${data.length} data received`);
      setSearchField("");
    },
    onError: () => {
      toast.error("Something went wrong with the search field");
    },
  });
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (searchField.length < 0) {
      return;
    }
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    console.log(data);
    mutate(data);
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center mt-4 flex-col ml-10"
    >
      <input
        type="text"
        placeholder="Search Your Bookmark"
        name="searchField"
        className="w-1/2 rounded-3xl px-6 py-2 border-2 border-black outline-slate-900 shadow-xl"
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        required
        autoComplete="off"
      />
      <button
        type="submit"
        className="border-2 border-black my-3 px-10 py-2 rounded-3xl bg-blue-500 shadow-xl hover:bg-blue-400"
      >
        Search
      </button>
    </form>
  );
}

export default SearchField;

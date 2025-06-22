import React, { SetStateAction, useState } from "react";
import { IBookMark } from "../popup";
interface ISearchField {
  setAllBookmark: React.Dispatch<SetStateAction<IBookMark[]>>;
}
function SearchField({ setAllBookmark }: ISearchField) {
  const [searchField, setSearchField] = useState<string>("");
  async function handleSearchFunctionality(post: {
    [k: string]: FormDataEntryValue;
  }) {
    const url = `http://localhost:3008/api/search-bookmark`;
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
    }
    const { data } = await res.json();
    setAllBookmark(data);
  }
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (searchField.length < 0) {
      return;
    }
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    console.log(data);
    // mutate(data);
    handleSearchFunctionality(data);
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center mt-4 flex-col ml-10"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "16px",
        flexDirection: "column",
      }}
    >
      <input
        type="text"
        placeholder="Search Your Bookmark"
        name="searchField"
        className="w-1/2 rounded-3xl px-6 py-2 border-2 border-black outline-slate-900 shadow-xl"
        style={{
          width: "75%",
          borderRadius: "1.5rem",
          margin: "4px 16px",
          padding: "16px 24px",
          outlineColor: "#0f172a",
          border: "2px solid black",
        }}
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        required
        autoComplete="off"
      />
      <button
        type="submit"
        className="border-2 border-black my-3 px-10 py-2 rounded-3xl bg-blue-500 shadow-xl hover:bg-blue-400"
        style={{
          margin: "0.75rem 0",
          borderRadius: "1.5rem",
          padding: "0.5rem 1.5rem",
          outlineColor: "#0f172a",
          border: "2px solid black",
        }}
      >
        Search
      </button>
    </form>
  );
}

export default SearchField;

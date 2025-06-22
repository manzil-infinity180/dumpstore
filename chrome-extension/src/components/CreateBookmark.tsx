import { useState, ChangeEvent, useEffect } from "react";

export default function Component() {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tag1, setTags1] = useState<string>("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [selectedTopics, setSelectedTopics] = useState("");
  const [customTopics, setCustomTopics] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [uploadDisableBtn, setuploadDisableBtn] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ title, link, description, image, tags, selectedTopics });
    const formdata = new FormData(e.currentTarget);
    formdata.append("tag", tags.join(","));
    const data = Object.fromEntries(formdata);
    chrome.runtime.sendMessage(
      {
        type: "formdata",
        data,
      },
      (response) => {
        console.log(response);
      }
    );
    const res = await fetch("http://localhost:3008/api/create-bookmark", {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
    });
    // console.log(res);
    const { data: fetchData } = await res.json();
    console.log(fetchData);
    chrome.runtime.sendMessage(
      {
        type: "formdata",
        fetchData,
      },
      (response) => {
        console.log(response);
      }
    );
  };
  useEffect(() => {
    async function getCurrentTabUrl() {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      if (tab.url) {
        setLink(tab.url);
      }
    }
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      console.log(e.target.files[0]);
    }
  };

  const handleTopicsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTopics(e.target.value);
  };

  const handleCustomTopicsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomTopics(e.target.value);
  };

  const handleAddCustomTopics = () => {
    if (customTopics && !topics.includes(customTopics)) {
      setTopics([...topics, customTopics]);
      setSelectedTopics(customTopics);
      setCustomTopics("");
    }
  };

  const handleCustomTagChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Enter" &&
      e.currentTarget.value &&
      !tags.includes(e.currentTarget.value)
    ) {
      setTags([...tags, e.currentTarget.value]);
      e.currentTarget.value = "";
      setTags1("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxWidth: "400px",
    margin: "0 auto",
    padding: "2rem",
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "0.25rem",
    fontSize: "1rem",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "0.5rem 1rem",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "0.25rem",
    cursor: "pointer",
    fontSize: "1rem",
  };

  const tagStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#e0f2fe",
    color: "#1e40af",
    padding: "0.25rem 0.5rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "600",
    marginRight: "0.5rem",
    marginBottom: "0.5rem",
  };

  async function generateYourTagAndDescription(post: string) {
    setuploadDisableBtn(true);
    const url = `http://localhost:3008/ai/get-tags-summary-gemini`;
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: post }),
    });

    if (!res.ok) {
      const info = await res.json();
      // const error = new APIError(
      //   "An error occurred while fetching the events",
      //   res.status,
      //   info
      // );
      setuploadDisableBtn(false);
      throw new Error("error");
    }
    const { data } = await res.json();
    setDescription(data.summary);
    setTags(data.tags);
    setTitle(data.title);
    setuploadDisableBtn(false);
    return data;
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "1rem",
        }}
      >
        Create New Bookmark
      </h2>
      {link && (
        <div
          className=" flex items-center justify-center"
          style={{
            display: "flex",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <img
            className="inline-block h-20 w-20 rounded-full ring-2 ring-white "
            style={{
              display: "inline-block",
              height: "5rem",
              width: "5rem",
              borderRadius: "50%",
              border: "2px solid white",
            }}
            src={
              image === null
                ? "https://img.logo.dev/<DOMAIN>?token=pk_PCz2SULwSFWmMvaP_SIfXg&size=150&format=png".replace(
                    "<DOMAIN>",
                    new URL(link).hostname
                  )
                : URL.createObjectURL(image)
            }
          />
        </div>
      )}

      <label htmlFor="title">Title</label>
      <input
        id="title"
        type="text"
        value={title}
        name="title"
        onChange={(e) => setTitle(e.target.value)}
        style={inputStyle}
        placeholder="Title for your bookmark"
        required
      />

      <label htmlFor="link">Link</label>
      <input
        id="link"
        name="link"
        type="url"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        style={inputStyle}
        placeholder="Enter the Link"
        required
      />
      {link && (
        <>
          <p
            className="text-xs opacity-45 font-bold"
            style={{
              fontSize: "0.75rem",
              lineHeight: "1rem",
              opacity: "0.45",
              fontWeight: "600",
            }}
          >
            *Generated By free tier Gemini AI model - It can make mistake
          </p>
          <button
            type="button"
            onClick={() => generateYourTagAndDescription(link)}
            style={{ ...buttonStyle }}
            className="px-4 py-3 bg-blue-600 text-white  font-bold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
          >
            {/* <IoMdAdd className="text-lg" /> */}
            Generate Tag And Description
          </button>
        </>
      )}

      <label htmlFor="tags">Tags</label>
      <div>
        {tags.map((tag, index) => (
          <span key={index} style={tagStyle}>
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              style={{
                marginLeft: "0.25rem",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={tag1}
        onChange={(e) => setTags1(e.target.value)}
        onKeyPress={handleCustomTagChange}
        style={inputStyle}
        placeholder="Type a custom tag and press Enter"
      />

      <label htmlFor="topics">Topics</label>
      <select
        id="topics"
        name="topics"
        value={selectedTopics}
        onChange={handleTopicsChange}
        style={inputStyle}
      >
        <option value="">Select a Topic</option>
        {topics.map((topic, index) => (
          <option key={index} value={topic}>
            {topic}
          </option>
        ))}
      </select>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={customTopics}
          onChange={handleCustomTopicsChange}
          style={{ ...inputStyle, flexGrow: 1 }}
          placeholder="Add a New Topic"
        />
        <button
          type="button"
          onClick={handleAddCustomTopics}
          style={buttonStyle}
        >
          Add
        </button>
      </div>

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ ...inputStyle, minHeight: "100px" }}
        placeholder="Add a description"
      />

      <label htmlFor="image">Upload Image</label>
      <input
        id="image"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={inputStyle}
      />

      <button type="submit" style={{ ...buttonStyle, marginTop: "1rem" }}>
        Create Bookmark
      </button>
    </form>
  );
}

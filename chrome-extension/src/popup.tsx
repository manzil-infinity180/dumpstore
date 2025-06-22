import React, { useEffect, useState } from "react";
// import { MemoryRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client";
import CreateBookmark from "./components/CreateBookmark";
import BookmarkCard from "./components/BookmarkCard";
import { TbEdit } from "react-icons/tb";
import SearchField from "./components/SearchField";
type TProvider = string;
type TState = "create" | "update" | "null";
const buttonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "0.25rem",
  cursor: "pointer",
  fontSize: "1rem",
  width:"100%",
  margin:"3px"
};
export interface IBookMark {
  _id: string;
  title: string;
  link: string;
  tag: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
  topics?: string;
  // _v: number;
}
const Popup = () => {
  const [state, setState] = useState<TState>("null");
  const [allBookmark, setAllBookmark] = useState<IBookMark[]>([]);
  function FindDate(date: Date) {
    const d1 = new Date(date);
    return d1.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  const handleAuth = (provider: TProvider) => {
    chrome.identity.launchWebAuthFlow(
      {
        url: `http://localhost:3008/auth/${provider}`,
        interactive: true,
      },
      (redirectUrl) => {
        if (chrome.runtime.lastError || !redirectUrl) {
          return new Error(
            `WebAuthFlow failed: ${
              chrome.runtime.lastError?.message || "Unknown error"
            }`
          );
        }
        const urlParams = new URLSearchParams(new URL(redirectUrl).search);
        const token = urlParams.get("token");
        chrome.runtime.sendMessage(
          {
            type: "formdata",
            redirectUrl,
            token,
          },
          (response) => {
            console.log(response);
          }
        );
      }
    );
  };

  const handleAllBookmark = async () => {
    const req = await fetch("http://localhost:3008/api/get-all-bookmark", {
      credentials: "include",
    });
    const data = await req.json();
    console.log(data);
    setAllBookmark(data.data as IBookMark[]);
    chrome.runtime.sendMessage(
      {
        type: "bookmark",
        data,
      },
      (response) => {
        console.log(response);
      }
    );
  };
  const handleUpdateAndBookmark = async () => {
    await handleAllBookmark();
    setState("update");
  };
  const handleWindow = () => {
    // chrome.tabs.update({ url: "http://example.com" });
    async function getCurrentTabUrl() {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      return tab.url;
    }
    chrome.runtime.sendMessage(
      {
        type: "tabx",
        data: chrome.tabs,
        tabsLink: getCurrentTabUrl(),
      },
      (response) => {
        console.log(response);
      }
    );
  };
  function handleExportData(){
    chrome.runtime.sendMessage(
      {
        type: "export-data-bookmark"
      },
      (response) => {
        console.log(response);
      }
    );
  }
  return (
    <div style={{ minWidth: "400px", minHeight: "500px" }}>
      {state === "null" && (
        <div>
          <h1>dumpStore - Bookmark Your Link</h1>
          {/* <p>You can create and update bookmark from here</p>
          <p>For more functionality you can go to website</p> */}
        </div>
      )}
      {/* <UpdateBookmark />
       */}
      <button onClick={() => handleAuth("google")}
      style={{...buttonStyle}}
        >Login with Google</button>
      <button onClick={() => handleAuth("github")} style={{...buttonStyle}}>Login with Github</button>
      {/* <button onClick={() => handleAuth("github")}>Go to other page</button> */}
      {/* <button onClick={handleAllBookmark} style={{...buttonStyle}}>Update Data</button> */}
      <button onClick={() => setState("create")} style={{...buttonStyle}}>Create New Bookmark</button>
      <button onClick={handleUpdateAndBookmark} style={{...buttonStyle}}>See Your All Bookmark</button>
      <button onClick={handleExportData} style={{...buttonStyle}}>Export All Bookmark to dumpStore</button>
      {/* <button onClick={handleWindow}>Logout</button> */}

      {state === "create" && <CreateBookmark />}
      {state === "update" && (
        <>
          <SearchField setAllBookmark={setAllBookmark} />
          {allBookmark.length > 0 &&
            allBookmark.map((el) => (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "12px",
                    paddingTop: "1rem",
                    margin: "3px 2px",
                    paddingBottom: "1rem",
                    paddingLeft: "0.5rem",
                    paddingRight: "0.5rem",
                    backgroundColor: "#e2e8f0", // bg-slate-100
                    cursor: "pointer",
                    maxHeight: "18rem", // max-h-72
                    minWidth: "16rem", // min-w-64
                    maxWidth: "24rem", // max-w-96
                    border: "1px solid #e2e8f0", // border
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => {
                      chrome.tabs.update({
                        url: el.link,
                      });
                    }}
                  >
                    <img
                      style={{
                        display: "inline-block",
                        height: "4rem",
                        width: "4rem",
                        borderRadius: "50%",
                        border: "2px solid white",
                      }}
                      src={el.image}
                      alt="bookmark"
                    />
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column" }}
                    onClick={() => {
                      chrome.tabs.update({
                        url: el.link,
                      });
                    }}
                  >
                    {/* <Link to={data.link} target="_blank" style={{ textDecoration: "none" }}> */}
                    <h1
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "0.5rem",
                      }}
                    >
                      {el.title}
                    </h1>
                    <div>
                      {el.tag.includes(",") &&
                        el.tag.split(",").map((x: string) => (
                          <button
                            key={x}
                            style={{
                              width: "25%",
                              backgroundColor: "white",
                              border: "1px solid #94a3b8", // border-slate-500
                              borderRadius: "12px",
                              margin: "0.25rem",
                            }}
                          >
                            {x}
                          </button>
                        ))}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                      opacity: 0.4,
                    }}
                  >
                    <TbEdit
                      style={{
                        fontSize: "1.25rem",
                      }}
                      onClick={() => {
                        chrome.tabs.update({
                          url: `http://localhost:5173/edit/${el._id}`,
                        });
                      }}
                    />
                    <button>{FindDate(el.createdAt as Date)}</button>
                    <p></p>
                  </div>
                </div>
              </>
            ))}
        </>
      )}
      
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);

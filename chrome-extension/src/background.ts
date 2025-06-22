chrome.action.onClicked.addListener(function () {
  chrome.tabs.create({ url: "index.html" });
});

chrome.runtime.onMessage.addListener(function (
  message,
  sender,
  senderResponse
) {
  if (message.type === "formdata") {
    console.log(message);
    console.log(message.token);
    // console.log(message.data);
  }
  return true;
});

chrome.runtime.onMessage.addListener(function (
  message,
  sender,
  senderResponse
) {
  if (message.type === "bookmark") {
    console.log(message);
    console.log(message.data);
    // console.log(message.data);
  }
  return true;
});

chrome.runtime.onMessage.addListener(function (
  message,
  sender,
  senderResponse
) {
  if (message.type === "tab") {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      console.log(tabs[0].url);
    });
  }
});

chrome.runtime.onMessage.addListener(function (
  message,
  sender,
  senderResponse
) {
  if (message.type === "tabx") {
    console.log(message);
    async function getCurrentTabUrl() {
      const tabs = await chrome.tabs.query({ active: true });
      console.log(tabs);
      return tabs[0].url;
    }
    (async () => {
      // see the note below on how to choose currentWindow or lastFocusedWindow
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      console.log(tab.url);
      // ..........
    })();
  }
});

let isPopupOpen: boolean = false; // Track popup state

chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
  if (isPopupOpen) {
    // Close the popup by setting an empty popup
    chrome.action.setPopup({ popup: "" });
    isPopupOpen = false;
  } else {
    // Open the popup by setting the popup to popup.html
    chrome.action.setPopup({ popup: "popup.html" });
    isPopupOpen = true;
  }
});

// Export Bookmark Data 
interface BookmarkNode {
  id: string;
  title: string;
  url?: string; // optional because folders won't have a URL
  children?: BookmarkNode[]; // optional, for folders
}

// Define a formatted bookmark interface
interface FormattedBookmark {
  title: string;
  url?: string;
  children?: FormattedBookmark[];
}

// Function to format bookmarks data
function formatBookmarks(bookmarkNodes: BookmarkNode[]): FormattedBookmark[] {
  const formattedBookmarks: FormattedBookmark[] = [];

  function traverseNodes(nodes: BookmarkNode[]): FormattedBookmark[] {
      return nodes.map(node => {
          if (node.url) {
              // This is a bookmark
              return {
                  title: node.title,
                  url: node.url
              };
          } else if (node.children) {
              // This is a folder
              return {
                  title: node.title,
                  children: traverseNodes(node.children)
              };
          }
      }).filter(node => node !== undefined) as FormattedBookmark[];
  }

  return traverseNodes(bookmarkNodes);
}

interface BookmarkNode {
  id: string;
  title: string;
  url?: string; // optional because folders won't have a URL
  children?: BookmarkNode[];
  dateAdded?: number,
  dateLastUsed?: number,
  parentId?: string // optional, for folders
}
/*
{
    "dateAdded": 1686047235275,
    "dateLastUsed": 1728932091001,
    "id": "31",
    "index": 1,
    "parentId": "1",
    "title": "Telegram Web",
    "url": "https://web.telegram.org/k/"
}
*/
// Define a formatted bookmark interface
interface FormattedBookmark {
  title: string;
  link: string;
  topics?: string;
  tag?: string;
  image?:string;
  user_id: string
}

/*
const {title, link} = req.body;
    const domain = new URL(link).hostname;
      if (!process.env.LOGO_FAVICON_URL) throw new Error("Favicon URl is invalid");
      const image = process.env.LOGO_FAVICON_URL.replace("<DOMAIN>", domain);
      const bookmark_object = {
        title,
        link,
        tag: "exported",
        topics: "exported data",
        image,
        // position: position + i,
        // topics_position: i,
        user_id: user.id,
      };
*/
// Function to flatten bookmarks data
function flattenBookmarks(bookmarkNodes: BookmarkNode[], user_id: string): FormattedBookmark[] {
  const flattenedBookmarks: FormattedBookmark[] = [];

  function traverseNodes(nodes: BookmarkNode[]): void {
      nodes.forEach(node => {
          if (node.url) {
              // This is a bookmark, add it to the flat array
              const domain = new URL(node.url).hostname;
              // haha its public key
              const image = `https://img.logo.dev/${domain}?token=pk_PCz2SULwSFWmMvaP_SIfXg&size=150&format=png`
              flattenedBookmarks.push({
                  title: node.title,
                  link: node.url,
                  image,
                  tag: "exported",
                  topics: "chrome",
                  user_id
              });
          } else if (node.children) {
              traverseNodes(node.children);
          }
      });
  }

  traverseNodes(bookmarkNodes);
  return flattenedBookmarks;
}

chrome.runtime.onMessage.addListener(function (
  message,
  sender,
  senderResponse
) {
  if (message.type === "export-data-bookmark") {
    console.log("hlleod");
    // /get-my-profile
   
    chrome.bookmarks.getTree(async (bookmarkTreeNodes) => {
      
      const req = await fetch("http://localhost:3008/api/get-my-profile", {
        credentials: "include",
      });
      const {data} = await req.json();
      const user_id: string = data._id;
      if(!user_id){
        throw new Error("You are not authenticated");
      }
      const flattenedData = flattenBookmarks(bookmarkTreeNodes, user_id);
      console.log(flattenedData);
      if(flattenedData.length >= 1){
        const req = await fetch("http://localhost:3008/api/upload-all-bookmark-from-extension", {
          method:"POST",
          credentials: "include",
          body: JSON.stringify({allbookmark: flattenedData}),
          headers: { "Content-Type": "application/json" },
        });
        const data = await req.json();
        console.log(data);
      }
      console.log(bookmarkTreeNodes);
      console.log("Flattened Bookmarks:", JSON.stringify(flattenedData, null, 2));
    });
  }
  return true;
});
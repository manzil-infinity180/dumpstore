import { useState, ChangeEvent, useEffect } from "react";
import {
  addRemainder,
  createBookmark,
  generateTagAndDescription,
  queryclient,
  uploadImageToCloud,
} from "../utils/http";
import { useMutation } from "@tanstack/react-query";
import { useProfileData } from "../utils/useProfileData";
import { useNavigate } from "react-router-dom";
import Loader from "../utils/Loader";
import toast from "react-hot-toast";
export interface ICalendar{
  kind?:string;
  id?:string;
  htmlLink?:string;
  summary?:string;
  description?:string;
  start?:string;
  end?:string
}
export default function UpdateBookmark() {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tag1, setTags1] = useState<string>("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [cloudImage, setCloudImage] = useState<string>("");
  const [selectedTopics, setSelectedTopics] = useState("");
  const [customTopics, setCustomTopics] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [uploadDisableBtn, setuploadDisableBtn] = useState(false);
  const [endDate, setEndDate] = useState<string>("");
  const [calendarData, setCalendarData] = useState<ICalendar | null>(null)
  const [check, setCheck] = useState(true);
  const navigate = useNavigate();
  const profileData = useProfileData();
  useEffect(() => {
    if (profileData && profileData.topics) {
      setTopics(profileData.topics);
    }
  }, [profileData]);
  const { mutate } = useMutation({
    mutationFn: createBookmark,
    onSuccess: () => {
      toast.success("Added new bookmark");
      navigate("/");
    },
    onSettled: () => {
      queryclient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
  const { mutate: UploadImageMutate } = useMutation({
    mutationFn: uploadImageToCloud,
    onSuccess: (uploadImageUrl) => {
      console.log("Yeah bro upload it!!!!!!!!");
      const { imageUrl } = uploadImageUrl;
      if (imageUrl.length) {
        setCloudImage(imageUrl);
        setuploadDisableBtn(false);
      }
      toast.success("Image Uploaded ✅");
    },
    onError: () => {
      toast.error("Failed to upload");
    },
  });
  const { mutate: generateMuate } = useMutation({
    mutationFn: generateTagAndDescription,
    onSuccess: (data) => {
      console.log(data);
      // setDescription(data.result[0].summary_text);
      // setTags(data.tags);

      setDescription(data.summary);
      setTags(data.tags);
      setTitle(data.title);
      setuploadDisableBtn(false);
      toast.success("Generated  ✅");
    },
    onError: (err) => {
      console.log(err);
      setuploadDisableBtn(false);
      toast.error("failed to generate, try after some time");
    },
  });
  const generateYourTagAndDescription = () => {
    generateMuate(link);
    setuploadDisableBtn(true);
  };
  function isValidHttpUrl(string: string) {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ title, link, description, image });
    const formdata = new FormData(e.currentTarget);
    if (tag1.length) {
      const arr = [...tags, tag1];
      console.log(arr);
      setTags(arr);
      console.log(tags);
    }
    formdata.append("tag", tags.join(","));
    if (cloudImage.length) {
      console.log(cloudImage);
      formdata.append("image", cloudImage);
    }
    console.log(tags);
    console.log(tag1);
    console.log(formdata);
    const filteredData = Object.fromEntries(formdata.entries());
    Object.keys(filteredData).forEach(
      (key) => filteredData[key] === "" && delete filteredData[key]
    );
    console.log(filteredData);
    if(calendarData!==null && !check){
      console.log(calendarData);
     filteredData.calendar = JSON.stringify(calendarData);
    }

    console.log(JSON.stringify(filteredData));
    mutate(filteredData);
    console.log(import.meta.env.VITE_LOGO_FAVICON_URL);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setuploadDisableBtn(true);
      console.log(image);
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
    console.log(e.key);
    if (
      e.key === "Enter" &&
      e.currentTarget.value &&
      !tags.includes(e.currentTarget.value)
    ) {
      setTags([...tags, e.currentTarget.value]);
      console.log(tags);
      console.log(e.currentTarget.value);
      e.currentTarget.value = "";
      setTags1("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  const handleImageUpload = () => {
    console.log(image);
    if (image !== null) {
      const formdata = new FormData();
      console.log(image);
      formdata.append("photo", image);
      console.log(formdata.getAll("photo"));
      console.log(formdata);
      const category = Object.fromEntries(formdata);
      if (!category) {
        throw new Error("Something went work");
      }
      setuploadDisableBtn(true);
      UploadImageMutate(formdata);
    }
  };
  const handleRemoveImage = () => {
    setImage(null);
    setuploadDisableBtn(false);
    // setIm("");
  };
  const {mutate: calendarRemainderMutate} = useMutation({
    mutationFn: addRemainder,
    onSuccess: (data) => {
      console.log(data);
      toast.success("Added to Calendar")
      // here i am saving the data
      setCheck(false);
      // setCheck({check:data, added: false});
      if(data === null) throw new Error("NO data found");
      const calendar = {
      kind: data.kind,
      id: data.id,
      htmlLink: data.htmlLink,
      summary: data.summary,
      description: data.description,
      start: data.start.dateTime,
      end:data.end.dateTime
      }
      console.log(calendar);
      setCalendarData(calendar);
      console.log(calendarData);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Redirect for authorization");
    }
  })
  const handleRemainder = async () => {
    if (!title || !link) {
      throw new Error("Value object is missing title or link");
    }
    if (!endDate) {
      throw new Error("End date is undefined");
    }
  
    const dateStart = new Date().toISOString();
    const dateEnd = new Date(endDate).toISOString();
  
    if (dateStart > dateEnd) {
      throw new Error("End date should be greater than start date");
    }

    const post = {
      summary: title,
      link: link,
      endDate: dateEnd,
      startDate: dateStart
    };
  
    console.log("Post object:", JSON.stringify(post));
    calendarRemainderMutate(post)
  };

  return (
    <div
      className={` ${
        uploadDisableBtn && "opacity-70"
      } min-h-screen flex items-center justify-center bg-white p-4`}
    >
      {uploadDisableBtn && <Loader />}
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Create New Bookmark
        </h2>
        {((link && isValidHttpUrl(link)) || image !== null) && (
          <div className=" flex items-center justify-center">
            <img
              className="inline-block h-20 w-20 rounded-full ring-2 ring-white "
              src={
                image === null
                  ? import.meta.env.VITE_LOGO_FAVICON_URL.replace(
                      "<DOMAIN>",
                      new URL(link).hostname
                    )
                  : URL.createObjectURL(image)
              }
            />
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          onKeyPress={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              required
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Title for your bookmark"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="link"
              className="block text-sm font-medium text-gray-700"
            >
              Link
            </label>
            <input
              id="link"
              type="url"
              required
              name="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter the Link"
            />
            {link && (
              <>
                <p className="text-xs opacity-45 font-bold">
                  *Generated By free tier Gemini AI model - It can make mistake
                </p>
                <button
                  type="button"
                  onClick={generateYourTagAndDescription}
                  className="px-4 py-3 bg-blue-600 text-white  font-bold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                >
                  {/* <IoMdAdd className="text-lg" /> */}
                  Generate Tag And Description
                </button>
              </>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700"
            >
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-800 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              required={tags.length === 0}
              value={tag1}
              onChange={(e) => setTags1(e.target.value)}
              onKeyPress={handleCustomTagChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 mt-2"
              placeholder="Type a custom tag and press Enter"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700"
            >
              Topics
            </label>
            <select
              id="tags"
              name="topics"
              value={selectedTopics}
              onChange={handleTopicsChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="">Select a Topic</option>
              {topics.map((tag, index) => (
                <option key={index} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={customTopics}
              onChange={handleCustomTopicsChange}
              className="flex-grow px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Add a New Topics"
            />
            <button
              type="button"
              onClick={handleAddCustomTopics}
              className="px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Add a description"
              rows={4}
            />
          </div>
           {(title && link && check ) && <div className="space-y-2">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Add Date to Calendar
                </label>
                <input
                  value={endDate}
                  onChange={(e) => setEndDate(e.currentTarget.value)}
                  type="date"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
               {endDate &&  <button
                      type="button"
                      className="ml-1 px-3 py-4 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                      onClick={handleRemainder}
                    >
                      Add Remainder
                    </button>}
            </div>}
          <div className="space-y-2">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Image
            </label>
            <input
              id="image"
              // name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="imageHanle w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {image !== null && (
              <>
                <button
                  type="button"
                  className="ml-1 px-3 py-4 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                  onClick={handleImageUpload}
                >
                  Upload It
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="ml-1 px-3 py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200"
                >
                  Remove
                </button>
              </>
            )}
          </div>
          <button
            type="submit"
            disabled={uploadDisableBtn}
            className={`${
              uploadDisableBtn && "opacity-65"
            } w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          >
            Create Bookmark
          </button>
        </form>
      </div>
    </div>
  );
}

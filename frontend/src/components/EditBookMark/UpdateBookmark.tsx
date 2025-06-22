import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, ChangeEvent, useEffect } from "react";
import { GrUpdate } from "react-icons/gr";
import { MdDeleteForever } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import {
  addRemainder,
  deleteBookmark,
  deleteRemainder,
  getBookMark,
  queryclient,
  updateBookmark,
  updateRemainder,
  uploadImageToCloud,
} from "../utils/http";
import { useNavigate, useParams } from "react-router-dom";
import { IBookMark } from "../AllBookMark";
import { useProfileData } from "../utils/useProfileData";
import toast from "react-hot-toast";
import { ICalendar } from "./CreateBookmark";
export interface IRemaindar {
  summary : string;
  link: string
  endDate: string
  startDate : string
  eventId?:string;
  bookmarkId?:string
}
export default function UpdateBookmark() {
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState("");
  const [cloudImage, setCloudImage] = useState<string>("");
  const [selectedTopics, setSelectedTopics] = useState("");
  const [customTopics, setCustomTopics] = useState("");
  const [topics, setTopics] = useState(["All"]);
  const [uploadDisableBtn, setuploadDisableBtn] = useState(false);
  const [checked, setChecked] = useState(false);
  const [endDate, setEndDate] = useState<string>("");
  const { bookmarkID } = useParams();
  const navigate = useNavigate();
  const [calendarData, setCalendarData] = useState<ICalendar | null>(null);
  const [value, setValue] = useState<IBookMark>({
    _id: bookmarkID as string,
    title: "",
    link: "",
    tag: "",
    image: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    topics: "",
  });
  const profileData = useProfileData();
  useEffect(() => {
    if (profileData && profileData.topics) {
      setTopics(profileData.topics);
    }
  }, [profileData]);
  const { mutate } = useMutation({
    mutationFn: updateBookmark,
    onSuccess: () => {
      toast.success("Updated Bookmark");
      queryclient.invalidateQueries({ queryKey: ["bookmark", bookmarkID] });
    },
    onSettled: () => {
      queryclient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
  const { data } = useQuery({
    queryKey: ["bookmark", bookmarkID],
    queryFn: async () => {
      const data = await getBookMark(bookmarkID as string);
      setValue(data);
      setDescription(data.description);
      setSelectedTopics(data.topics);
      setTopics((s) => [...s, data.topics]);
      if(data.calendar && data.calendar!== null){
        setCalendarData(data.calendar);
        const changeDateFormate = new Date(data.calendar.end).toISOString().substring(0,10);
        setEndDate(changeDateFormate);
        console.log(changeDateFormate);
        console.log(endDate);
      }
      // if(data.topics)
      console.log(data);
      return data;
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    const formdata = new FormData(e.currentTarget);
    formdata.append("id", bookmarkID as string);
    if (cloudImage.length) {
      formdata.set("image", cloudImage);
    } else {
      formdata.append("image", data.image);
    }
    const filteredData = Object.fromEntries(formdata.entries());
    Object.keys(filteredData).forEach(
      (key) => filteredData[key] === "" && delete filteredData[key]
    );
    if(calendarData!==null){
      console.log(calendarData);
     filteredData.calendar = JSON.stringify(calendarData);
    }
    console.log(filteredData);
    console.log(data.image.includes("cloudinary"));
    mutate(filteredData);
  };
  async function handleDeleteBookMark() {
    const data = await deleteBookmark(bookmarkID as string);
    console.log(data);
    navigate("/");
  }
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setValue({
      ...value,
      [e.target.name]: e.currentTarget.value,
    });
  };
  const { mutate: UploadImageMutate } = useMutation({
    mutationFn: uploadImageToCloud,
    onSuccess: (uploadImageUrl) => {
      console.log("Yeah bro upload it!!!!!!!!");
      const { imageUrl } = uploadImageUrl;
      if (imageUrl.length) {
        setCloudImage(imageUrl);
        setuploadDisableBtn(false);
      }
      toast.success("Updated your bookmark");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      const link = URL.createObjectURL(e.target.files[0]);
      setImageURL(link);
    }
  };
  const handleRemoveImage = () => {
    setImage(null);
    setImageURL("");
    setCloudImage("");
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

  const {mutate: calendarRemainderMutate} = useMutation({
    mutationFn: calendarData? updateRemainder: addRemainder,
    onSuccess: (data) => {
      console.log(data);
      toast.success("Add/Updated Remainder");
      queryclient.invalidateQueries({ queryKey: ["bookmark", bookmarkID] });
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
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })
  const {mutate: calendarDeleteMutate} = useMutation({
    mutationFn: deleteRemainder,
    onSuccess: (data) => {
      console.log(data);
      toast.success("Deleted Remainder");
      queryclient.invalidateQueries({ queryKey: ["bookmark", bookmarkID] });
      setCalendarData(null);
      setEndDate("");
    },
    onError: (error) => {
      console.log(error);
    }
  })
  const handleRemainder = async () => {
    if (!value || !value.title || !value.link) {
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
    
    let post: IRemaindar = {
      summary: value.title,
      link: value.link,
      endDate: dateEnd,
      startDate: dateStart
    };
  
    console.log("Post object:", JSON.stringify(post));
    if(calendarData){
      post.eventId = calendarData.id;
      post.bookmarkId = value._id;
    }
    calendarRemainderMutate(post)
  };
  function handleDeleteRemainder(){
    if(calendarData!==null && calendarData.id!==undefined){
      const data = {eventId: calendarData.id, bookmarkId: value._id}
      calendarDeleteMutate(data)
    }
  }
  return (
    <>
      {data && (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
          <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
              Update Bookmark
            </h2>
            <div className=" flex items-center justify-center">
              <img
                className="inline-block h-20 w-20 rounded-full ring-2 ring-white "
                src={imageURL.length === 0 ? data.image : imageURL}
              />
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={value.title}
                  onChange={handleInput}
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
                  name="link"
                  type="url"
                  value={value.link}
                  onChange={handleInput}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter the Link"
                />
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
                  name="tag"
                  // value={tag1}
                  value={value.tag}
                  onChange={handleInput}
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
                  className="px-4 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                >
                  <IoMdAdd className="text-lg" />
                </button>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Add Date to Calendar
                </label>
                <input
                  value={endDate}
                  onChange={(e) => {console.log(e.currentTarget.value) 
                    setEndDate(e.currentTarget.value)}}
                  type="date"
                  data-testid={calendarData? calendarData.end : endDate}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
               {endDate &&  <button
                      type="button"
                      className="ml-1 px-3 py-4 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                      onClick={handleRemainder}
                    >
                      {calendarData ?'Update' :'Add'} Remainder
                    </button>}
                {
                  calendarData && <button
                  type="button"
                  className="ml-1 px-3 py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200"
                  onClick={handleDeleteRemainder}
                >
                  Delete Remainder
                </button>
                }
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
                  multiple={false}
                  onChange={handleImageChange}
                  className={`${
                    imageURL ? "w-3/4" : "w-full"
                  } px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
                />
                {imageURL && (
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

              {!(cloudImage || imageURL) &&
                data.image.includes("cloudinary") && (
                  <>
                    <input
                      type="checkbox"
                      id="vehicle1"
                      name="isChecked"
                      value={checked ? "yes" : "no"}
                      checked={checked}
                      onChange={() => setChecked((s) => !s)}
                    />
                    <label className="font-semibold">
                      &#32; Remove Custom Upload Image and use default Favicon
                      :&#40;
                    </label>
                  </>
                )}
              <br></br>
              <button
                type="submit"
                disabled={uploadDisableBtn}
                className={`
                  ${uploadDisableBtn && "opacity-65"}
                  flex text-center justify-center w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              >
                <GrUpdate size={20} className="mx-3" />
                <span>Update Bookmark</span>
              </button>
            </form>
            <button
              type="submit"
              onClick={handleDeleteBookMark}
              className="flex text-center justify-center w-full mt-3 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              <MdDeleteForever size={25} className="mx-3" />
              <span>Delete Bookmark</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

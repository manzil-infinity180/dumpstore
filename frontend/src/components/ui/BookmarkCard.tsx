import { FiExternalLink } from "react-icons/fi";
import { Link } from "react-router-dom";
import { TbEdit } from "react-icons/tb";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface IBookMark {
  _id: string;
  link: string;
  image: string;
  title: string;
  tag: string;
  createdAt: Date;
  description?: string;
}

function BookmarkCard({
  data,
}: {
  data: IBookMark
}) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: data._id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  function FindDate(date: Date) {
    const d1 = new Date(date);
    return d1.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="touch-none border bg-white shadow-md rounded-xl cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg max-w-sm w-full mx-auto"
        data-tooltip-id={data._id}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <img
              className="h-16 w-16 rounded-full ring-2 ring-gray-200 object-cover"
              src={data.image}
              alt={data.title}
            />
            <Link
              to={data.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              <FiExternalLink className="text-xl" />
            </Link>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {data.title}
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {data.tag.split(",").map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
              >
                {tag.trim()}
              </span>
            ))}
          </div>

          <div className="mt-auto flex justify-between items-center text-sm text-gray-500">
            <Link
              to={`/edit/${data._id}`}
              className="flex items-center hover:text-blue-500 transition-colors"
            >
              <TbEdit className="text-xl mr-1" />
              <span>Edit</span>
            </Link>
            <p>{FindDate(data.createdAt)}</p>
          </div>
        </div>
      </div>
      {/* <TooltipDescription
        id={data._id}
        place="bottom"
        content={data.description && !uploadDisableBtn ? data.description : ""}
      /> */}
    </>
  );
}

export default BookmarkCard;

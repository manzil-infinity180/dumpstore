import { FiExternalLink } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { IBookMark } from "../popup";
import { TbEdit } from "react-icons/tb";

function BookmarkCard({ data }: { data: IBookMark }) {
  const navigate = useNavigate();

  function FindDate(date: Date) {
    const d1 = new Date(date);
    return d1.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        paddingTop: "1rem",
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
      onClick={() => window.open(data.link)}
    >
      {/* <Link to={data.link} target="_blank" style={{ textDecoration: "none" }}> */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <FiExternalLink style={{ fontSize: "1.25rem" }} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
          src={data.image}
          alt="bookmark"
        />
      </div>
      {/* </Link> */}

      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* <Link to={data.link} target="_blank" style={{ textDecoration: "none" }}> */}
        <h1
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "0.5rem",
          }}
        >
          {data.title}
        </h1>
        {/* </Link> */}

        <div>
          {data.tag.includes(",") &&
            data.tag.split(",").map((x: string) => (
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
        onClick={() => navigate(`/edit/${data._id}`)}
      >
        <TbEdit style={{ fontSize: "1.25rem", marginRight: "0.25rem" }} />
        <p>{FindDate(data.createdAt as Date)}</p>
      </div>
    </div>
  );
}

export default BookmarkCard;

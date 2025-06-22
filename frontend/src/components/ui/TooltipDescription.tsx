import { Tooltip } from "react-tooltip";
interface ITooltip {
  id: string;
  place:
    | "top"
    | "top-start"
    | "top-end"
    | "right"
    | "right-start"
    | "right-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end";
  content: string;
}
export function TooltipDescription({ id, place, content }: ITooltip) {
  return (
    <>
      {content.length > 0 && (
        <Tooltip
          id={id}
          place={place}
          content={content}
          className="max-w-xs rounded-3xl"
        />
      )}
    </>
  );
}

export default TooltipDescription;

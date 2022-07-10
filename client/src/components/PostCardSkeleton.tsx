import { Fragment } from "react";
import ActionButton from "./ActionButton";
import Vote from "./Vote";

export default function PostCardSkeleton() {
  return (
    <div className="flex mb-4 bg-white rounded">
      {/* Vote */}
      <div className="w-10 py-1 text-center bg-gray-200 rounded-l">
        {/* Upvote */}
        <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500">
          <i className={"icon-arrow-up"}></i>
        </div>
        <p className="w-7/12 h-4 ml-2 text-xs font-bold bg-gray-300 rounded animate-pulse"></p>
        {/* Downvote */}
        <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600">
          <i className={"icon-arrow-down"}></i>
        </div>
      </div>
      {/* Post data */}
      <div className="w-full p-2">
        <div className="w-11/12 h-5 mb-2 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-7/12 h-5 mb-2 bg-gray-300 rounded animate-pulse"></div>
        <p className="w-9/12 h-5 bg-gray-300 rounded animate-pulse"></p>
        <div className="flex">
          <div>
            <a>
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span className="font-bold">
                  <span className="bg-gray-300 rounded animate-pulse">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>{" "}
                  Comments
                </span>
              </ActionButton>
            </a>
          </div>
          <ActionButton>
            <i className="mr-1 fas fa-share fa-xs"></i>
            <span className="font-bold">Share</span>
          </ActionButton>
          <ActionButton>
            <i className="mr-1 fas fa-bookmark fa-xs"></i>
            <span className="font-bold">Save</span>
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

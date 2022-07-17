import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function TopSubSkeleton() {
  return (
    <div>
      <div className="flex items-center px-4 py-2 text-xs border-b">
        <Skeleton circle width={27} height={27} className="mr-2" />
        <Skeleton width={250} />
      </div>
      <div className="flex items-center px-4 py-2 text-xs border-b">
        <Skeleton circle width={27} height={27} className="mr-2" />
        <Skeleton width={250} />
      </div>
      <div className="flex items-center px-4 py-2 text-xs border-b">
        <Skeleton circle width={27} height={27} className="mr-2" />
        <Skeleton width={250} />
      </div>
      <div className="flex items-center px-4 py-2 text-xs border-b">
        <Skeleton circle width={27} height={27} className="mr-2" />
        <Skeleton width={250} />
      </div>
      <div className="flex items-center px-4 py-2 text-xs border-b">
        <Skeleton circle width={27} height={27} className="mr-2" />
        <Skeleton width={250} />
      </div>
    </div>
  );
}

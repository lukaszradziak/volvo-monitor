import { useEffect, useState } from "react";
import {
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/solid";

const Pagination = ({
  page = 1,
  pages = 10,
  maxVisible = 3,
  onChange = () => {},
}) => {
  const [listPages, setListPages] = useState([]);
  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    const listPages = [];
    for (let i = activePage - maxVisible; i <= activePage + maxVisible; i++) {
      if (i >= 1 && i <= pages) {
        listPages.push(i);
      }
    }

    setListPages(listPages);
  }, [pages, activePage]);

  useEffect(() => {
    setActivePage(page);
  }, [page]);

  const changePage = (page) => {
    if (activePage === page) {
      return;
    }
    setActivePage(page);
    onChange(page);
  };

  return (
    <div className="flex justify-center">
      <nav
        className="select-none relative flex rounded-md -space-x-px"
        aria-label="Pagination"
      >
        <a
          onClick={() => changePage(1)}
          className="cursor-pointer relative inline-flex items-center px-1 py-2 sm:px-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <ChevronDoubleLeftIcon className="h-4 w-4" aria-hidden="true" />
        </a>
        <a
          onClick={() => changePage(activePage > 1 ? activePage - 1 : 1)}
          className="cursor-pointer relative inline-flex items-center px-1 py-2 sm:px-4 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
        </a>
        {listPages.map((page) => (
          <a
            key={page}
            onClick={() => changePage(page)}
            aria-current="page"
            className={`${
              page == activePage
                ? `z-10 bg-indigo-50 border-indigo-500 text-indigo-600`
                : ``
            } cursor-pointer bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-2 py-2 sm:px-4 border text-sm font-medium `}
          >
            {page}
          </a>
        ))}
        <a
          onClick={() =>
            changePage(activePage < pages ? activePage + 1 : pages)
          }
          className="cursor-pointer relative inline-flex items-center px-1 py-2 sm:px-4 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
        </a>
        <a
          onClick={() => changePage(pages)}
          className="cursor-pointer relative inline-flex items-center px-1 py-2 sm:px-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <ChevronDoubleRightIcon className="h-4 w-4" aria-hidden="true" />
        </a>
      </nav>
    </div>
  );
};

export default Pagination;

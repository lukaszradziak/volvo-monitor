import { useEffect, useRef, useState } from "react";
import Pagination from "../elements/Pagtionation";

const Paginator = ({
  perPage = 20,
  items = [],
  render = () => {},
  scrollable = false,
}) => {
  const scrollElement = useRef(null);
  const [visibleItems, setVisibleItems] = useState([]);
  const [page, setPage] = useState(1);
  const pages = Math.ceil(items.length / perPage);

  useEffect(() => {
    const visibleItems = items.slice((page - 1) * perPage, perPage * page);
    setVisibleItems(visibleItems);
  }, [items, page]);

  const changePage = (page) => {
    setPage(page);

    scrollable &&
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  };

  return (
    <div ref={scrollElement}>
      {visibleItems.map((item, index) => (
        <div key={index}>{render(item, index)}</div>
      ))}
      {pages && pages > 1 ? (
        <Pagination pages={pages} onChange={(page) => changePage(page)} />
      ) : null}
    </div>
  );
};

export default Paginator;

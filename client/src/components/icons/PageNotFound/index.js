import React from "react";
import pageNotFound from "./img/notFound.png";

const PageNotFound = ({ height, width }) => {
  return (
    <img
      src={pageNotFound}
      alt="page not found"
      style={{ height: height, width: width }}
    />
  );
};

export default PageNotFound;

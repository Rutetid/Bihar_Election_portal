import React from "react";
import { Link } from "react-router-dom";

const Header = ({ currentTime }) => {
  return (
    <div
      className="relative rounded-2xl overflow-hidden mb-2"
      style={{ height: "220px" }}
    >
      <img
        src={"election.jpg"}
        alt="Indian General Elections"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "brightness(0.7)" }}
      />
      <div className="absolute inset-0 flex flex-col md:flex-row justify-between items-center px-8 py-8">
        <div className="flex flex-col justify-center items-start text-white z-10">
          <h1 className="text-3xl md:text-4xl font-bold">
            Bihar Elections Dashboard
            <br />
            2025
          </h1>
          <div className="items-center gap-4 mt-2">
            <p className="">Muzzafarpur Vidhan Sabha Constituency</p>
            <Link
              to="/about"
              className="text-white text-base font-medium flex items-center gap-1 hover:underline"
            >
              Learn More <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center z-10">
          <span className="text-base font-semibold text-white mb-2 tracking-wide">
            Current Time
          </span>
          <div className="flex gap-2">
            <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg px-4 py-2 text-center">
              <div className="text-2xl font-bold">
                {currentTime.getHours().toString().padStart(2, "0")}
              </div>
              <div className="text-xs font-medium">Hours</div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg px-4 py-2 text-center">
              <div className="text-2xl font-bold">
                {currentTime.getMinutes().toString().padStart(2, "0")}
              </div>
              <div className="text-xs font-medium">Minutes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

/* eslint-disable react/prop-types */
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function DentalCarousel({
  showButtons = true,
  delay = 3000,
  items = [],
  footerText = "",
}) {
  return (
    <Carousel
      className="w-full max-w-xs p-0 m-0"
      plugins={[
        Autoplay({
          delay: delay,
          active: true,
        }),
      ]}
    >
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={index} className="hover:cursor-pointer bg-white mt-2 rounded-md">
            <div className="p-0 mt-[-2px] bg-primary flex justify-center items-center">
              <FontAwesomeIcon size={"lg"} className="text-white" icon={faCircleInfo} />
              <h4 className="text-xl font-bold text-white p-4"> {item.title}</h4>
            </div>
            <div className="py-2 px-6 text-black text-left leading-loose">
              <span> {item.content}</span>
            </div>

            <div className="justify-start capitalize text-gray-700 text-xs mt-3">{footerText}</div>
            <div className="py-2 px-4 leading-loose">
              {Array.isArray(item.additional_content)
                ? item.additional_content?.map((content, index) => (
                    <p key={index} className="text-sm text-primary capitalize leading-relaxed">
                      {content}&nbsp;
                    </p>
                  ))
                : item.additional_content}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {showButtons && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  );
}

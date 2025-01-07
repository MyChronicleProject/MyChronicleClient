import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { File } from "../../Models/File";

const ImageSlider: React.FC<{ images: File[] }> = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div style={{ maxWidth: "200px", margin: "20px auto", height: "200px" }}>
      <Slider {...settings}>
        {images.length > 0 ? (
          images.map((image) => (
            <div
              key={image.id}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <img
                decoding="async"
                src={`data:image/jpeg;base64,${image.content}`}
                alt={image.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "150px",
                  objectFit: "contain",
                  objectPosition: "center",
                }}
              />
            </div>
          ))
        ) : (
          <p>No images found</p>
        )}
      </Slider>
    </div>
  );
};

export default ImageSlider;

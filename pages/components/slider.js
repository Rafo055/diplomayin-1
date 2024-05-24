import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";


// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
const Slider = () => {
  return (
    <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
      <SwiperSlide>
        <img src={"./images/slider/dilijann.jpg"} />
        <div
          style={{
            padding: "20px 16px 16px",
            background: "#143047",

          }}
        >
          <div style={{ textAlign: "left", fontWeight: "bold" }}>Դիլիջան</div>
          <div style={{ textAlign: "left", fontSize: "14px" }}>69կմ</div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <img src={'./images/slider/erevan-gisher.jpg'} />
        <div
          style={{
            padding: "20px 16px 16px",
            background: "#143047",
          }}
        >
          <div style={{ textAlign: "left", fontWeight: "bold" }}>Երևան</div>
          <div style={{ textAlign: "left", fontSize: "14px" }}>1 km</div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <img src={"./images/slider/caxkadzor-photo1.jpg"} />
        <div
          style={{
            padding: "20px 16px 16px",
            background: "#143047",
          }}
        >
          <div style={{ textAlign: "left", fontWeight: "bold" }}>Ծաղկաձոր</div>
          <div style={{ textAlign: "left", fontSize: "14px" }}>54 կմ</div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default Slider;

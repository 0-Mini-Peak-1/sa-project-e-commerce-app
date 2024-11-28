import React from "react";
import "../styles/ContactPage.css";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const ContactPage = () => {
    const navigate = useNavigate();
  return (
    <div className="contact-container">
      <Header />

      {/* Main Content */}
      <main className="contact-main">
        {/* Contact Information */}
        <section className="contact-info">
          <h2>ติดต่อได้ที่</h2>
          <div className="divider"></div>
          <p>เบอร์โทรศัพท์ : 093-3261942 , 093-3262364</p>
          <p>อีเมล : pandp-padprinting@hotmail.com</p>
          <p>Line@ : pandp2557</p>
        </section>

        {/* Store Location */}
        <section className="store-location">
          <h2>ที่อยู่ของร้าน</h2>
          <div className="divider"></div>
          {/* Embedded Google Map */}
          <iframe
            className="google-map"
            title="Store Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3872.286624526192!2d100.6340318757898!3d13.941531792871134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d7d9b81397359%3A0xbb471e452886ee7a!2zUEFEIFBSSU5USU5HICYgU0lMSyBTQ1JFRU4gKOC4q-C4iOC4gS7guJ7guLXguYHguK3guJnguJTguYzguJ7guLUg4LmB4Lie4LiV4Lie4Lij4Li04LmJ4LiZ4LiV4Li04LmJ4LiHKQ!5e0!3m2!1sen!2sth!4v1732473749951!5m2!1sen!2sth"
            allowFullScreen
            loading="lazy"
          ></iframe>
          <p>
            ห้างหุ้นส่วนจำกัด พีแอนด์พี แพดพริ้นติ้ง <br />
            เลขที่ 464/21 หมู่ 4 <br />
            ต.คูคต &nbsp;อ.ลำลูกกา <br />
            จังหวัดปทุมธานี 12130
          </p>
        </section>
      </main>
    </div>
  );
};

export default ContactPage;

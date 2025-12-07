import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="container mx-auto py-10 px-4">
        {/* Grid container */}
        <div className="grid md:grid-cols-3 gap-20 text-center">
          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Contact Us</h3>
            <p>LocalChefBazaar</p>
            <p>123 Food Street, Dhaka, Bangladesh</p>
            <p>Email: info@localchefbazaar.com</p>
            <p>Phone: +880 1234 567890</p>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Working Hours</h3>
            <p>Monday - Friday: 9:00 AM - 9:00 PM</p>
            <p>Saturday: 10:00 AM - 8:00 PM</p>
            <p>Sunday: Closed</p>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Follow Us</h3>
            <div className="flex justify-center space-x-4 mt-2">
              <a href="#" className="hover:text-white"><FaFacebookF size={20} /></a>
              <a href="#" className="hover:text-white"><FaTwitter size={20} /></a>
              <a href="#" className="hover:text-white"><FaInstagram size={20} /></a>
              <a href="#" className="hover:text-white"><FaLinkedinIn size={20} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} LocalChefBazaar. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

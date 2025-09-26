import React from "react";

const Footer = ({ year = new Date().getFullYear(), siteName = "MelodyVault" }) => (
  <footer className="footer">
    <p>&copy; {year} {siteName}. All rights reserved.</p>
  </footer>
);

export default Footer;

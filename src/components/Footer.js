import React from "react";
import '../styling/Footer.css';

function Footer(){
    return (
      <React.Fragment>
        <div className="footer_component">
          <footer className="bg-body-tertiary text-center text-lg-start">
            <div className="text-center p-3">
              © 2024 Copyright
            </div>
          </footer>
        </div>
      </React.Fragment>
    );
}

export default Footer;
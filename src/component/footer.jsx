import React from 'react';
import './footer.scss';

export default (props) => {
  return (
    <div className="copyright" >Copyright © {new Date().getFullYear()} Ballet Global Inc. All rights reserved.</div>
  )
}
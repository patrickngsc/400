import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import {BrowserRouter,Routes,Route,Link, useParams} from 'react-router-dom';
import { CSVLink } from 'react-csv';
import './Style.css';
import ReactHtmlParser from "react-html-parser";
var day = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
var room = ['room 1','room 2','room 3','room 4'];
var flag = 0;

class DataEntryMenu extends React.Component{
  constructor(props){
    super(props);
}
  render(){
    return ( 
      <div>
      <Link to={"/DataEntryPage"} className='nav-link' style={{ textDecoration: 'none',border:'solid',width:'fit-content' }}>Back</Link>
        <div>
          <ul class="list-group">
            <li class="list-group-item"><Link to={"/"} className='nav-link' style={{ textDecoration: 'none' }}>Staff List</Link></li>
            <li class="list-group-item"><Link to={"/"} className='nav-link' style={{ textDecoration: 'none' }}>Student List</Link></li>
            <li class="list-group-item"><Link to={"/"} className='nav-link' style={{ textDecoration: 'none' }}>Venue List</Link></li>
            <li class="list-group-item"><Link to={"/"} className='nav-link' style={{ textDecoration: 'none' }}>Presentation List</Link></li>
            <li class="list-group-item"><Link to={"/"} className='nav-link' style={{ textDecoration: 'none' }}>HC03 - Room Unavailability</Link></li>
            <li class="list-group-item"><Link to={"/"} className='nav-link' style={{ textDecoration: 'none' }}>HC04 - Staff Unavailability</Link></li>
            <li class="list-group-item"><Link to={"/"} className='nav-link' style={{ textDecoration: 'none' }}>HC05 - Student Unavailability</Link></li>
            <li class="list-group-item"><Link to={"/"} className='nav-link' style={{ textDecoration: 'none' }}>SC01 - Maximum Number of Slots Attended by Staffs</Link></li>
            <li class="list-group-item"><Link to={"/"} className='nav-link' style={{ textDecoration: 'none' }}>SC02 - Maximum Number of Days Having Presentations by Staffs</Link></li>
            <li class="list-group-item"><Link to={"/"} className='nav-link' style={{ textDecoration: 'none' }}>SC03 - Preference of Changing Venue by Staffs</Link></li>
          </ul>
          
          
        </div>
        
      </div>
  );
  }
}

export default DataEntryMenu;
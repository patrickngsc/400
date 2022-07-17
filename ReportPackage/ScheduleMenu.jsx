import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import {BrowserRouter,Routes,Route,Link, useParams} from 'react-router-dom';
import { CSVLink } from 'react-csv';
import './Style.css';
import { Button } from 'react-bootstrap';

var day = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
var room = ['room 1','room 2','room 3','room 4'];
var flag = 0;
const sampleData = [
  { staff: "S001", maximumNumberOfDays: 3 },
  { staff: "S002", maximumNumberOfDays: 4 },
  { staff: "S003", maximumNumberOfDays: 5 }
];


const sampleHeaders = [
  { label: "Staff", key: "staff" },
  { label: "Maximum Number of Days", key: "maximumNumberOfDays" }
];

const csvReport = {
  filename: "testingreport.csv",
  header: sampleHeaders,
  data: sampleData
};
class ScheduleMenu extends React.Component{
  constructor(props){
    super(props);
}
callAPI(){
  const splitUrl = window.location.href.split("/");
  const folderID = splitUrl[splitUrl.length-1];
}
componentWillMount(){
    this.callAPI();
}
  render(){

    //<CSVLink {...csvReport }> Export to CSV </CSVLink> to be added
    const splitUrl = window.location.href.split("/");
    const folderID = splitUrl[splitUrl.length-1];
    const dfolder = folderID.split('+')[0];
    const cfolder = folderID.split('+')[1];
    const sfolder = folderID.split('+')[2];
    var constraintFolder = cfolder;
    constraintFolder=constraintFolder.replace("%20"," ");
    return ( 
      <div>
       <h3>Academic Year: {dfolder}</h3>
      <h3>Presentation Constraint Folder: {constraintFolder}</h3>
      <h3>Version: {sfolder}</h3>
        <div>
          <ul className="list-group">
            <li className="list-group-item"><Link to={'/masterschedulepage/'+folderID} className='nav-link' style={{ textDecoration: 'none' }}>Master Schedule</Link></li>
            <li className="list-group-item"><Link to={'/individualschedulepage/'+folderID} className='nav-link' style={{ textDecoration: 'none' }}>Individual Schedule</Link></li>
          </ul>
          <br/>

        </div>
        <Button variant="secondary" onClick={()=>{window.location.href="/reportpage"}}>Back</Button>
      </div>
  );
  }
}

export default ScheduleMenu;
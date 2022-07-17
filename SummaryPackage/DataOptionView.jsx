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
class DataOptionView extends React.Component{
  constructor(props){
    super(props);
    this.state={roomUnavailabilities:[]};
}
callAPI(){
  const splitUrl = window.location.href.split("/");
  const folderID = splitUrl[splitUrl.length-1];
  const dataFolderID = folderID.split('+')[0];
  const constraintFolderID = folderID.split('+')[1];
  const requestOptions = {
      method: 'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({folder:folderID})
  };

      fetch("http://localhost:9000/getData/getHC03?dfolder="+dataFolderID+"&cfolder="+constraintFolderID)
            .then(res => res.json())
            .then(roomUnavailabilities => this.setState({roomUnavailabilities: roomUnavailabilities},()=>console.log('HC3 fetched..'
            ,roomUnavailabilities)));
}
componentWillMount(){
    this.setState({presentations: []});
    this.callAPI();
}
  render(){

    //<CSVLink {...csvReport }> Export to CSV </CSVLink> to be added

    console.log(this.state.roomUnavailabilities.length);
    var noOfRoom=this.state.roomUnavailabilities.length;
    const splitUrl = window.location.href.split("/");
    const folderID = splitUrl[splitUrl.length-1];
    const dataFolderID = folderID.split("+")[0];
    const constraintFolderID = folderID.split("+")[1];
    const constraintFolder = constraintFolderID.replace("%20"," ");
    return ( 
      <div>
       <h2>Data Summary and Result</h2>
      <h3>Academic Year: {dataFolderID}</h3>
      <h3>Constraint Folder: {constraintFolder}</h3>
        <div>
          <ul className="list-group">
            <li className="list-group-item"><Link to={"/supExaAssign/"+folderID} className='nav-link' style={{ textDecoration: 'none' }}>Presentation List</Link></li>
            <li className="list-group-item"><Link to={"/hcThree/"+folderID+"&"+noOfRoom} className='nav-link' style={{ textDecoration: 'none' }}>HC03 - Room Unavailability</Link></li>
            <li className="list-group-item"><Link to={"/hcFour/"+folderID+"&"+noOfRoom} className='nav-link' style={{ textDecoration: 'none' }}>HC04 - Staff Unavailability</Link></li>
            <li className="list-group-item"><Link to={"/hcFive/"+folderID+"&"+noOfRoom} className='nav-link' style={{ textDecoration: 'none' }}>HC05 - Student Unavailability</Link></li>            
            <li className="list-group-item"><Link to={"/scOne/"+folderID} className='nav-link' style={{ textDecoration: 'none' }}>SC01 - Maximum Number of Slots Attended by Staffs</Link></li>
            <li className="list-group-item"><Link to={"/scTwo/"+folderID} className='nav-link' style={{ textDecoration: 'none' }}>SC02 - Maximum Number of Days Having Presentations by Staffs</Link></li>
            <li className="list-group-item"><Link to={"/scThree/"+folderID} className='nav-link' style={{ textDecoration: 'none' }}>SC03 - Preference of Remaining in the Same Venue by Staffs (For Consecutive Slots)</Link></li>
            <li className="list-group-item"><Link to={"/scheduleResult/"+folderID} className='nav-link' style={{ textDecoration: 'none' }}>Schedule and Execution History</Link></li>
          </ul>
          <br/>
          
          <Button variant="secondary" onClick={()=>{window.location.href="/home"}}>Back</Button>  
        </div>
        
      </div>
  );
  }
}

export default DataOptionView;
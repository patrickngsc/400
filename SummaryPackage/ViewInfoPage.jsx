import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import {BrowserRouter,Routes,Route,Link, useParams} from 'react-router-dom';
import { CSVLink } from 'react-csv';
import './Style.css';

import ExistingConstraintSection from './ExistingConstraintSection';
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
class ViewInfoPage extends React.Component{
  render(){

    //<CSVLink {...csvReport }> Export to CSV </CSVLink> to be added


    return ( 
      <div>
      <h2>Data Summary and Result</h2>
      <ExistingConstraintSection/> 
      <br/>
      <Button variant="secondary" onClick={()=>{window.location.href="/home"}}>Back</Button>  
      </div>
  );
  }
}

export default ViewInfoPage;
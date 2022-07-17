import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import {BrowserRouter,Routes,Route,Link, useParams} from 'react-router-dom';
import { CSVLink } from 'react-csv';
import './Style.css';

import ExistingDataSection from './ExistingDataSection';
import { Button } from 'react-bootstrap';
var day = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
var room = ['room 1','room 2','room 3','room 4'];
var flag = 0;

class EditInfoPage extends React.Component{

  render(){
    return ( 
      <div>
      <h2>Data Entry Page</h2>
      <ExistingDataSection/>
      <br/>
      <Button variant="secondary" onClick={()=>{window.location.href="DataEntryPage"}}>Back</Button>
           
      </div>
  );
  }
}

export default EditInfoPage;
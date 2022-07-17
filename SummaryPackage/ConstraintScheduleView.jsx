import { CSVLink } from 'react-csv';
import './Style.css';
import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import ReactHtmlParser from "react-html-parser";
import CSVReader from './CSVReader';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
var day = ['Monday','Tuesday','Wednesday','Thursday','Friday'];


function ConstraintScheduleView(props){
    var roomList = props.roomList;
    var constraintList = props.constraintList;
  var room = [];
  var slotList =props.slotList;
  console.log(roomList);
  console.log(constraintList);
  var numOfRoom=roomList.length;
  if(roomList.length === 0){
    return (<div>
    </div>);
    }
     else {
      var mytable = "<table id=\"timetableView1\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr className = \"row\">"+
      "<th>Day</th><th>Venue</th>";
      for(let i=0;i<slotList.length;i++){
        mytable+=("<th>"+slotList[i]+"</th>")
      }
      var roomCount = 0;
      var noOfSlots = numOfRoom*slotList.length*5;
      var currentRoom;
      for (var i = 0; i < noOfSlots; i++) {
          if (parseInt(i % (numOfRoom*slotList.length) % slotList.length) === 0) {
              
            mytable += "<tr>";
            if(roomCount === 0){
              mytable += "<td class='cell' rowspan=\""+numOfRoom+"\"style={{ border: 'solid' }}>"+day[parseInt(i/(numOfRoom*slotList.length))]+"</td>";
            }  
            currentRoom=roomList[roomCount];
              mytable += "<td class='cell' style={{ border: 'solid' }}>"+currentRoom+"</td>";
              roomCount ++;
          }
          
          if(constraintList.includes((i+1).toString())){
            mytable += "<td class='unavailablecell' style={{ border: 'solid' }}>" + (i+1) + "</td>";
          }
          else{
            mytable += "<td class='cell' style={{ border: 'solid' }}>" + (i+1) + "</td>";
          }
            
          

          if(parseInt((i + 1) % (numOfRoom*slotList.length) % slotList.length) === 0){
              mytable += "</tr>";
          }
          if(roomCount === numOfRoom){
            roomCount = 0;
          }
        }
        mytable += "</tr></tbody></table><p>red color indicates unavailability</p>";



        return (<div>
        {ReactHtmlParser(mytable)}
             </div>);
     }
}
export default ConstraintScheduleView;
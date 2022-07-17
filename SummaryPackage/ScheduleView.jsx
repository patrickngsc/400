import { CSVLink } from 'react-csv';
import './Style.css';
import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import ReactHtmlParser from "react-html-parser";
import CSVReader from './CSVReader';
var day = ['Monday','Tuesday','Wednesday','Thursday','Friday'];


function ScheduleView(props){
  var roomList = props.rooms;
  var numOfRoom=roomList.length;
  var slotList=props.slotList;
  console.log(slotList)
  console.log(roomList);
  if(props.slots.length === 0){
    return (<div>
    </div>);
    }
     else {
            
    var mytable = "<h4>Schedule</h4><table id=\"timetableView\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr className = \"row\">"+
    "<th>Day</th><th>Venue</th>"
    for(let i=0;i<slotList.length;i++){
      mytable+=("<th>"+slotList[i]+"</th>")
    }
    mytable+="</tr>";
    var roomCount = 0;
    var currentRoom;
    for (var i = 0; i < props.slots.length; i++) {
        if (parseInt(i % (numOfRoom*slotList.length) % slotList.length) === 0) {
          mytable += "<tr>";
          if(roomCount === 0){
            mytable += "<td rowspan=\""+roomList.length+"\"style={{ border: 'solid' }}>"+day[parseInt(i/(numOfRoom*slotList.length))]+"</td>";
          }  
          currentRoom=roomList[roomCount];
            mytable += "<td style={{ border: 'solid' }}>"+currentRoom+"</td>";
            roomCount ++;
        }
        if(props.slots[i]!=="null"){
          mytable += "<td style={{ border: 'solid' }}>P" + props.slots[i] + "</td>";
        }
        else{
          mytable += "<td style={{ border: 'solid' }}> </td>";
        }
        if(parseInt((i + 1) % (numOfRoom*slotList.length) % slotList.length) === 0){
            mytable += "</tr>";
        }
        if(roomCount === roomList.length){
          roomCount = 0;
        }
      }
      mytable += "</tr></tbody></table>";
        return (<div>
        {ReactHtmlParser(mytable)}
             </div>);
     }
}
export default ScheduleView;
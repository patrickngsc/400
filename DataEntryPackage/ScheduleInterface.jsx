import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import {BrowserRouter,Routes,Route,Link, useParams} from 'react-router-dom';
import { CSVLink } from 'react-csv';
import './Style.css';
import ReactHtmlParser from "react-html-parser";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Button, Modal, Overlay, OverlayTrigger, Table } from 'react-bootstrap';
import TimetableInterface from './TimetableInterface';
const days=['Mon','Tue','Wed','Thu','Fri'];
class ScheduleInterface extends React.Component{
  constructor(props){
    super(props);
    this.state = {schedule:"",group:"",individual:"",slotList:[],showModal:false,selectedSlot:""}

}

callAPI(){
    const splitUrl = window.location.href.split("/");
    const folderID = splitUrl[splitUrl.length-1];
    this.setState({group:this.props.group});
    this.setState({individual:this.props.individual});
    this.setState({slotList:this.props.slotList});
    //fetch getunavailability
    fetch("http://localhost:9000/getData/getUnavailability?folder="+folderID+"&group="+this.props.group+"&individual="+this.props.individual)
    .then(res => res.json())
        .then(UnavailSlot => {
            if(UnavailSlot!==null){
                console.log(UnavailSlot);
                for(let i = 0; i<UnavailSlot.length;i++){
                    if(UnavailSlot[i]!==null){
                        document.getElementById(UnavailSlot[i]).className="unavailable-slot";
                    }
                }
            }
        }).then(()=>{
            console.log("Read unavailability done")
        });
    //then setunavailability getelementbyid
}
componentWillMount(){
    this.callAPI();
}
  render(){
    console.log(this.props.group);
    console.log(this.props.individual);
    const splitUrl = window.location.href.split("/");
    const folderID = splitUrl[splitUrl.length-1];
    const openModal=(id)=>{
        console.log(document.getElementById(id));
        this.setState({selectedSlot:id});
        this.setState({showModal:true});
    }
    const closeModal=()=>{
        this.setState({showModal:false});
        this.setState({selectedSlot:""});
    }
    const setAvailability=(id)=>{
        const splitUrl = window.location.href.split("/");
        const folderID = splitUrl[splitUrl.length-1];
        const group = this.props.group;
        const individual = this.props.individual;
        var status = document.getElementById(id).className.split("-")[0];
        if(document.getElementById(id).className==="available-slot"){
            document.getElementById(id).className="unavailable-slot";
            //fetch set unavailable pass folder group individual slot status
            fetch("http://localhost:9000/setData/setAvailability?folder="+folderID+"&group="+group+"&individual="+individual+"&slot="+id+"&status=unavailable")
            .then(res => console.log("successfully set unavailable"));
        }
        else{
            document.getElementById(id).className="available-slot";
            //fetch set available
            fetch("http://localhost:9000/setData/setAvailability?folder="+folderID+"&group="+group+"&individual="+individual+"&slot="+id+"&status=available")
            .then(res =>  console.log("successfully set available"));
        }
        //this.setState({showModal:false});
    }
    return ( 
      <div>
        <h5>Set Unavailability</h5>
        <div id='schedule-table'>
            <table  id="timetableView1" cellPadding="0" cellSpacing="0">
            <tr>
                        <th>Day</th>
                        <th>{this.props.slots[0]}</th>
                        <th>{this.props.slots[1]}</th>
                        <th>{this.props.slots[2]}</th>
                        <th>{this.props.slots[3]}</th>
                        <th>{this.props.slots[4]}</th>
                        <th>{this.props.slots[5]}</th>
                        <th>{this.props.slots[6]}</th>
                        <th>{this.props.slots[7]}</th>
                        <th>{this.props.slots[8]}</th>
                        <th>{this.props.slots[9]}</th>
                        <th>{this.props.slots[10]}</th>
                        <th>{this.props.slots[11]}</th>
                        <th>{this.props.slots[12]}</th>
                        <th>{this.props.slots[13]}</th>
                        <th>{this.props.slots[14]}</th>
                    </tr>
                    <tr>
                        <td>{days[0]}</td>
                        <td id={days[0]+"-0"} className='available-slot' onClick={()=>setAvailability(days[0]+"-0")}></td>
                        <td id={days[0]+"-1"} className='available-slot' onClick={()=>setAvailability(days[0]+"-1")}></td>
                        <td id={days[0]+"-2"} className='available-slot' onClick={()=>setAvailability(days[0]+"-2")}></td>
                        <td id={days[0]+"-3"} className='available-slot' onClick={()=>setAvailability(days[0]+"-3")}></td>
                        <td id={days[0]+"-4"} className='available-slot' onClick={()=>setAvailability(days[0]+"-4")}></td>
                        <td id={days[0]+"-5"} className='available-slot' onClick={()=>setAvailability(days[0]+"-5")}></td>
                        <td id={days[0]+"-6"} className='available-slot' onClick={()=>setAvailability(days[0]+"-6")}></td>
                        <td id={days[0]+"-7"} className='available-slot' onClick={()=>setAvailability(days[0]+"-7")}></td>
                        <td id={days[0]+"-8"} className='available-slot' onClick={()=>setAvailability(days[0]+"-8")}></td>
                        <td id={days[0]+"-9"} className='available-slot' onClick={()=>setAvailability(days[0]+"-9")}></td>
                        <td id={days[0]+"-10"} className='available-slot' onClick={()=>setAvailability(days[0]+"-10")}></td>
                        <td id={days[0]+"-11"} className='available-slot' onClick={()=>setAvailability(days[0]+"-11")}></td>
                        <td id={days[0]+"-12"} className='available-slot' onClick={()=>setAvailability(days[0]+"-12")}></td>
                        <td id={days[0]+"-13"} className='available-slot' onClick={()=>setAvailability(days[0]+"-13")}></td>
                        <td id={days[0]+"-14"} className='available-slot' onClick={()=>setAvailability(days[0]+"-14")}></td>
                    </tr>
                    <tr>
                        <td>{days[1]}</td>
                        <td id={days[1]+"-0"} className='available-slot' onClick={()=>setAvailability(days[1]+"-0")}></td>
                        <td id={days[1]+"-1"} className='available-slot' onClick={()=>setAvailability(days[1]+"-1")}></td>
                        <td id={days[1]+"-2"} className='available-slot' onClick={()=>setAvailability(days[1]+"-2")}></td>
                        <td id={days[1]+"-3"} className='available-slot' onClick={()=>setAvailability(days[1]+"-3")}></td>
                        <td id={days[1]+"-4"} className='available-slot' onClick={()=>setAvailability(days[1]+"-4")}></td>
                        <td id={days[1]+"-5"} className='available-slot' onClick={()=>setAvailability(days[1]+"-5")}></td>
                        <td id={days[1]+"-6"} className='available-slot' onClick={()=>setAvailability(days[1]+"-6")}></td>
                        <td id={days[1]+"-7"} className='available-slot' onClick={()=>setAvailability(days[1]+"-7")}></td>
                        <td id={days[1]+"-8"} className='available-slot' onClick={()=>setAvailability(days[1]+"-8")}></td>
                        <td id={days[1]+"-9"} className='available-slot' onClick={()=>setAvailability(days[1]+"-9")}></td>
                        <td id={days[1]+"-10"} className='available-slot' onClick={()=>setAvailability(days[1]+"-10")}></td>
                        <td id={days[1]+"-11"} className='available-slot' onClick={()=>setAvailability(days[1]+"-11")}></td>
                        <td id={days[1]+"-12"} className='available-slot' onClick={()=>setAvailability(days[1]+"-12")}></td>
                        <td id={days[1]+"-13"} className='available-slot' onClick={()=>setAvailability(days[1]+"-13")}></td>
                        <td id={days[1]+"-14"} className='available-slot' onClick={()=>setAvailability(days[1]+"-14")}></td>
                    </tr>
                    <tr>
                        <td>{days[2]}</td>
                        <td id={days[2]+"-0"} className='available-slot' onClick={()=>setAvailability(days[2]+"-0")}></td>
                        <td id={days[2]+"-1"} className='available-slot' onClick={()=>setAvailability(days[2]+"-1")}></td>
                        <td id={days[2]+"-2"} className='available-slot' onClick={()=>setAvailability(days[2]+"-2")}></td>
                        <td id={days[2]+"-3"} className='available-slot' onClick={()=>setAvailability(days[2]+"-3")}></td>
                        <td id={days[2]+"-4"} className='available-slot' onClick={()=>setAvailability(days[2]+"-4")}></td>
                        <td id={days[2]+"-5"} className='available-slot' onClick={()=>setAvailability(days[2]+"-5")}></td>
                        <td id={days[2]+"-6"} className='available-slot' onClick={()=>setAvailability(days[2]+"-6")}></td>
                        <td id={days[2]+"-7"} className='available-slot' onClick={()=>setAvailability(days[2]+"-7")}></td>
                        <td id={days[2]+"-8"} className='available-slot' onClick={()=>setAvailability(days[2]+"-8")}></td>
                        <td id={days[2]+"-9"} className='available-slot' onClick={()=>setAvailability(days[2]+"-9")}></td>
                        <td id={days[2]+"-10"} className='available-slot' onClick={()=>setAvailability(days[2]+"-10")}></td>
                        <td id={days[2]+"-11"} className='available-slot' onClick={()=>setAvailability(days[2]+"-11")}></td>
                        <td id={days[2]+"-12"} className='available-slot' onClick={()=>setAvailability(days[2]+"-12")}></td>
                        <td id={days[2]+"-13"} className='available-slot' onClick={()=>setAvailability(days[2]+"-13")}></td>
                        <td id={days[2]+"-14"} className='available-slot' onClick={()=>setAvailability(days[2]+"-14")}></td>
                    </tr>
                    <tr>
                        <td>{days[3]}</td>
                        <td id={days[3]+"-0"} className='available-slot' onClick={()=>setAvailability(days[3]+"-0")}></td>
                        <td id={days[3]+"-1"} className='available-slot' onClick={()=>setAvailability(days[3]+"-1")}></td>
                        <td id={days[3]+"-2"} className='available-slot' onClick={()=>setAvailability(days[3]+"-2")}></td>
                        <td id={days[3]+"-3"} className='available-slot' onClick={()=>setAvailability(days[3]+"-3")}></td>
                        <td id={days[3]+"-4"} className='available-slot' onClick={()=>setAvailability(days[3]+"-4")}></td>
                        <td id={days[3]+"-5"} className='available-slot' onClick={()=>setAvailability(days[3]+"-5")}></td>
                        <td id={days[3]+"-6"} className='available-slot' onClick={()=>setAvailability(days[3]+"-6")}></td>
                        <td id={days[3]+"-7"} className='available-slot' onClick={()=>setAvailability(days[3]+"-7")}></td>
                        <td id={days[3]+"-8"} className='available-slot' onClick={()=>setAvailability(days[3]+"-8")}></td>
                        <td id={days[3]+"-9"} className='available-slot' onClick={()=>setAvailability(days[3]+"-9")}></td>
                        <td id={days[3]+"-10"} className='available-slot' onClick={()=>setAvailability(days[3]+"-10")}></td>
                        <td id={days[3]+"-11"} className='available-slot' onClick={()=>setAvailability(days[3]+"-11")}></td>
                        <td id={days[3]+"-12"} className='available-slot' onClick={()=>setAvailability(days[3]+"-12")}></td>
                        <td id={days[3]+"-13"} className='available-slot' onClick={()=>setAvailability(days[3]+"-13")}></td>
                        <td id={days[3]+"-14"} className='available-slot' onClick={()=>setAvailability(days[3]+"-14")}></td>
                    </tr>
                    <tr>
                        <td>{days[4]}</td>
                        <td id={days[4]+"-0"} className='available-slot' onClick={()=>setAvailability(days[4]+"-0")}></td>
                        <td id={days[4]+"-1"} className='available-slot' onClick={()=>setAvailability(days[4]+"-1")}></td>
                        <td id={days[4]+"-2"} className='available-slot' onClick={()=>setAvailability(days[4]+"-2")}></td>
                        <td id={days[4]+"-3"} className='available-slot' onClick={()=>setAvailability(days[4]+"-3")}></td>
                        <td id={days[4]+"-4"} className='available-slot' onClick={()=>setAvailability(days[4]+"-4")}></td>
                        <td id={days[4]+"-5"} className='available-slot' onClick={()=>setAvailability(days[4]+"-5")}></td>
                        <td id={days[4]+"-6"} className='available-slot' onClick={()=>setAvailability(days[4]+"-6")}></td>
                        <td id={days[4]+"-7"} className='available-slot' onClick={()=>setAvailability(days[4]+"-7")}></td>
                        <td id={days[4]+"-8"} className='available-slot' onClick={()=>setAvailability(days[4]+"-8")}></td>
                        <td id={days[4]+"-9"} className='available-slot' onClick={()=>setAvailability(days[4]+"-9")}></td>
                        <td id={days[4]+"-10"} className='available-slot' onClick={()=>setAvailability(days[4]+"-10")}></td>
                        <td id={days[4]+"-11"} className='available-slot' onClick={()=>setAvailability(days[4]+"-11")}></td>
                        <td id={days[4]+"-12"} className='available-slot' onClick={()=>setAvailability(days[4]+"-12")}></td>
                        <td id={days[4]+"-13"} className='available-slot' onClick={()=>setAvailability(days[4]+"-13")}></td>
                        <td id={days[4]+"-14"} className='available-slot' onClick={()=>setAvailability(days[4]+"-14")}></td>
                    </tr>
            </table>
            <Modal show={this.state.showModal} size='xl'>
              <Modal.Header>{this.state.selectedSlot.split("-")[0]+" "+this.props.slots[this.state.selectedSlot.split("-")[1]]}</Modal.Header>
              <Modal.Body>
                  {(this.state.selectedSlot!=="")?
                  ((document.getElementById(this.state.selectedSlot).className==="available-slot")?"Set Unavailable?":"Set Available?"):""}
              </Modal.Body>
              <Modal.Footer>
                    <Button  onClick={setAvailability}>Yes</Button>
                  <Button  onClick={closeModal}>Close</Button>
              </Modal.Footer>
          </Modal>
        </div>
        <br></br>
      </div>
  );
  }
}

export default ScheduleInterface;
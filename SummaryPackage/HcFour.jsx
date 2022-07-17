import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import { VictoryBar, VictoryChart } from 'victory';
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom';
import './Style.css';
import ConstraintScheduleView from './ConstraintScheduleView';
import { Button } from 'react-bootstrap';
class HcFour extends React.Component{
    constructor(props){
        super(props);
        this.state={staffUnavailabilities:[],rooms:[],unavailabilities:[],timeSlotList:[],selectedStaff:''};
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
        var roomUnavails=[];
        fetch("http://localhost:9000/getData/getHC03?dfolder="+dataFolderID+"&cfolder="+constraintFolderID)
        .then(res => res.json())
        .then(roomUnavailabilities => roomUnavails= roomUnavailabilities,()=>console.log('HC3 fetched..'
        ,roomUnavails))
        .then(()=>{
            var rList=[];
            for(let r=0;r<roomUnavails.length;r++){
                rList.push(roomUnavails[r].room);
            }
            this.setState({rooms:rList});
        });
        

            fetch("http://localhost:9000/getData/getHC04?dfolder="+dataFolderID+"&cfolder="+constraintFolderID)
            .then(res => res.json())
            .then(staffUnavailabilities => {
                this.setState({staffUnavailabilities: staffUnavailabilities},()=>console.log('HC4 fetched..'
            ,staffUnavailabilities))
        });

        fetch("http://localhost:9000/getData/getSolutionSlotList?dfolder="+dataFolderID+"&cfolder="+constraintFolderID)
            .then(res => res.json())
                .then(dataArr => this.setState({timeSlotList: dataArr},()=>console.log('Slot list fetched..'
                ,dataArr)));
    }
    componentWillMount(){
        this.callAPI();
    }

    render() {
        const splitUrl = window.location.href.split("/");
        var folderAndRoom=splitUrl[splitUrl.length-1];
        var folderID=folderAndRoom.split('&')[0];
        var noOfRoom=folderAndRoom.split('&')[1];

        const staffSelect=()=>{
            var selectedStaff=document.getElementById("select-staff").value;
            if(selectedStaff!=='Select Staff'){
                this.setState({selectedStaff:selectedStaff});
            var index=0;
            for(let s=0;s<this.state.staffUnavailabilities.length;s++){
                if(this.state.staffUnavailabilities[s].staff===selectedStaff){
                    index=s;
                }
            }
            document.getElementById('staff-string').innerText=selectedStaff;
            this.setState({unavailabilities:this.state.staffUnavailabilities[index].unavailableSlots});
        }
        }
        return ( <div>
            <h2>HC04 - Staff Unavailability</h2>
            <Button variant="secondary" onClick={()=>{window.location.href="/dataoptionview/"+folderID}}>Back</Button>
            <br/>
            <select onChange={staffSelect} id="select-staff">
            <option>Select Staff</option>
            {this.state.staffUnavailabilities.map(staffUnavailability =>
                <option>{staffUnavailability.staff}</option>
                )}
            </select>

            <h5 id='staff-string'></h5>
            <div id="unavailability-schedule">
                <ConstraintScheduleView roomList={this.state.rooms} constraintList={this.state.unavailabilities} slotList={this.state.timeSlotList}/>
            </div>


            </div>
        );
    }
}



export default HcFour;
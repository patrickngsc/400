import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import { VictoryBar, VictoryChart } from 'victory';
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom';
import './Style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import ConstraintScheduleView from './ConstraintScheduleView';
import { Button } from 'react-bootstrap';
var day = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
class HcThree extends React.Component{
    constructor(props){
        super(props);
        this.state={roomUnavailabilities:[],rooms:[],timeSlotList:[],unavailabilities:[]};
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
            ,roomUnavailabilities)))
            .then(()=>{
                
                var noOfRoom=this.state.roomUnavailabilities.length;
                var roomList=[];

                var constraintList=[];
                for(let u=0;u<noOfRoom;u++){
                    for(let j=0;j<this.state.roomUnavailabilities[u].unavailableSlots.length;j++){
                        constraintList.push(this.state.roomUnavailabilities[u].unavailableSlots[j]);
                    }
                }
                this.setState({unavailabilities:constraintList});

                for(let r=0;r<noOfRoom;r++){
                    roomList.push(this.state.roomUnavailabilities[r].room);
                }
                console.log("roomlist")
                console.log(roomList)
                this.setState({rooms:roomList});



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
        console.log(this.state.roomUnavailabilities);
        console.log(this.state.rooms);
        console.log(this.state.unavailabilities);
        const splitUrl = window.location.href.split("/");
        var folderAndRoom=splitUrl[splitUrl.length-1];
        var folderID=folderAndRoom.split('&')[0];
        var noOfRoom=folderAndRoom.split('&')[1];




        
        return ( <div>
            <h2>HC03 - Room Unavailability</h2>
            <Button variant="secondary" onClick={()=>{window.location.href="/dataoptionview/"+folderID}}>Back</Button>
            <div id="unavailability-schedule">
                <ConstraintScheduleView roomList={this.state.rooms} constraintList={this.state.unavailabilities} slotList={this.state.timeSlotList}/>
            </div>





            </div>
        );
    }
}

export default HcThree;
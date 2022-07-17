import { CSVLink } from 'react-csv';
import './Style.css';
import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import ReactHtmlParser from "react-html-parser";
import CSVReader from './CSVReader';
import ScheduleView from './ScheduleView';
import {Link, useParams} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Button } from 'react-bootstrap';
var exeHistoryText = '';
var exeLogText = '';
var scCumulate = 0;
var hcCumulate = 0;
class ScheduleResult extends React.Component{
  constructor(props){
        super(props);
        this.state={filenames:[],selectedFolder:'',rooms:[],scheduleSlots:[],timeSlotList:[],exeHistory:'',exeLog:'',showButton:false};
    }
    callAPI(){
        const splitUrl = window.location.href.split("/");
        const folderID = splitUrl[splitUrl.length-1];
        const dataFolderID = folderID.split('+')[0];
        const constraintFolderID = folderID.split('+')[1];
        const formData = new FormData();
        formData.append('folder',folderID);
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


            fetch("http://localhost:9000/getData/getScheduleFolder?dfolder="+dataFolderID+"&cfolder="+constraintFolderID)
            .then(res => res.json())
            .then(results => this.setState({filenames: results},()=>console.log('Path fetched..'
            ,results)));

            fetch("http://localhost:9000/getData/getSolutionSlotList?dfolder="+dataFolderID+"&cfolder="+constraintFolderID)
            .then(res => res.json())
                .then(dataArr => this.setState({timeSlotList: dataArr},()=>console.log('Slot list fetched..'
                ,dataArr)));

    }
    componentWillMount(){
        this.callAPI();
    }
    render(){
      const splitUrl = window.location.href.split("/");
      const folderID = splitUrl[splitUrl.length-1];
      const dataFolderID = folderID.split('+')[0];
      const constraintFolderID = folderID.split('+')[1];
      const submit=()=>{
        if(this.state.selectedFolder==="Please Select Folder"||this.state.selectedFolder===''){
            alert("Please select folder");
        }
        else{
          var tempSlot;
            alert("Folder Selected: "+this.state.selectedFolder);
            //set schedule view
            fetch("http://localhost:9000/getData/getScheduleData?dfolder="+dataFolderID+"&cfolder="+constraintFolderID+"&execution="+this.state.selectedFolder)
            .then(res => res.json())
            .then(slots => tempSlot = slots)
            .then(()=>
              {
                console.log(tempSlot[0].slot);
                this.setState({scheduleSlots: tempSlot[0].slot});
                this.setState({showButton:true});
               // const scheduleDiv = document.getElementById('scheduleview');
               // scheduleDiv.innerHTML = '<ScheduleView primary={true} slots={'+this.state.scheduleSlots[0].slot+'}/>';
                
            }
              );
            
            
            //set execution view
            fetch("http://localhost:9000/getData/getScheduleExeHistory?dfolder="+dataFolderID+"&cfolder="+constraintFolderID+"&execution="+this.state.selectedFolder)
            .then(res => res.json())
            .then(results => this.setState({exeHistory: results},()=>console.log('Execution History fetched..'
            ,results)))
            .then(
              ()=>{
                exeHistoryText = '<h4>Execution History</h4><ul class="list-group">';
                for(let i=0;i<this.state.exeHistory.length;i++){
                  var attrib = this.state.exeHistory[i].attribute.toString().split(':')[0];
                  var value = this.state.exeHistory[i].attribute.toString().split(':')[1];
                  exeHistoryText+=("<li class=\"list-group-item\"><div class=\"row\"><div class=\"col-sm\">"+attrib+"</div><div class=\"col-sm\">"+value+"</div></div></li>");
                }
                exeHistoryText += '</ul>';
                const exeDiv = document.getElementById('executionview');
                exeDiv.innerHTML=exeHistoryText;
            }
            );
            //set log view
            fetch("http://localhost:9000/getData/getScheduleLog?dfolder="+dataFolderID+"&cfolder="+constraintFolderID+"&execution="+this.state.selectedFolder)
            .then(res => res.json())
            .then(results => this.setState({exeLog: results},()=>console.log('Path fetched..'
            ,results)))
            .then(
              ()=>{
                hcCumulate=0;
                scCumulate=0;
                exeLogText = '<h4>Execution Log</h4><ul class="list-group">';
                for(let i=0;i<this.state.exeLog.length;i++){
                  var penalty=parseInt(this.state.exeLog[i].split(" ")[0].split("+")[1]);
                  if(this.state.exeLog[i].includes('HC')){
                    hcCumulate+=penalty;
                  }
                  else if(this.state.exeLog[i].includes('SC')){
                    scCumulate+=penalty;
                  }
                  /*var attrib = this.state.exeLog[i].attribute.toString().split(':')[0];
                  var value = this.state.exeLog[i].attribute.toString().split(':')[1];*/
                  exeLogText+=("<li class=\"list-group-item\">"+this.state.exeLog[i]+"</li>");
                }
                exeLogText += '</ul>';
                const logDiv = document.getElementById('logview');
                var hcscSummary = '<ul class="list-group"><li class=\"list-group-item\">Penalty from hard constraints: '+hcCumulate+"</li><li class=\"list-group-item\">Penalty from soft constraints: "
                +scCumulate+"</li>";
                logDiv.innerHTML=hcscSummary;
            }
            );
        }
    }

    const exportButton=()=>{
      fetch("http://localhost:9000/setData/setScheduleOutput?cFolder="+folderID+"&sFolder="+this.state.selectedFolder)
            .then(res => res.text())
            .then(results => alert("Created. Master Schedule Directory: "+results));
    }

    console.log(exeHistoryText);
        return (
        <div>
            
          
          <h2>Schedule and Execution History</h2>
          <form>
            <h3>Select Schedule Folder</h3>
            <select id="folder-choice" onChange={()=>this.setState({selectedFolder:document.getElementById('folder-choice').value})}>
            <option>Please Select Folder</option>
                {this.state.filenames.map(filename=>
                <option key="{filename}">
                    {filename.filename}
                </option>)}
            </select>
            <Button  
                onClick={(e)=>{
                    e.preventDefault();
                    submit();
                }}>Select</Button>
            </form>

            
            <br/>
            <Button variant="secondary" onClick={()=>{window.location.href="/dataoptionview/"+folderID}}>Back</Button>
            <br/>
            <br/>
            <div id='scheduleview'>
              <ScheduleView rooms={this.state.rooms} slots={this.state.scheduleSlots} slotList={this.state.timeSlotList}/>
            </div>
            <br/>
            <br/>
            <div id='executionview'>

            </div>
            <br/>
            <div id='logview'>

            
            </div>
          </div>);
         }
        
}

export default ScheduleResult;
import React, { useState, useEffect, useRef} from 'react';
import { csv } from 'd3';
import {BrowserRouter,Routes,Route,Link, useParams} from 'react-router-dom';
import { CSVLink } from 'react-csv';
import './Style.css';
import { Button } from 'react-bootstrap';
import PDF, { Text, AddPage, Line, Image, Table, Html } from 'jspdf-react'
import ReactToPrint from 'react-to-print';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ReportScheduleView from './ReportScheduleView';
const styleH1 = {
    fontSize: '15px',
    textAlign: 'center',
    color: 'red'
  };
   
  const invisibleStyle = {
    display: 'none',
  };
   


class IndividualSchedulePage extends React.Component{
  constructor(props){
    super(props);
    this.state={schedule:[],staffList:[],selectedStaff:"",showDiv:false,timeSlotList:[],scheduleSlots:[],rooms:[],index:[]};
}
callAPI(){
  const splitUrl = window.location.href.split("/");
  const folderID = splitUrl[splitUrl.length-1];
  const dfolder = folderID.split('+')[0];
  const cfolder = folderID.split('+')[1];
  const sfolder = folderID.split('+')[2];
  fetch("http://localhost:9000/getData/getSolutionStaffList?dfolder="+dfolder+"&cfolder="+cfolder+"&sfolder="+sfolder)
        .then(res => res.json())
        .then(results => this.setState({staffList: results},()=>console.log('Staff fetched..'
        ,results)));
        fetch("http://localhost:9000/getData/getSolutionSlotList?dfolder="+dfolder+"&cfolder="+cfolder)
        .then(res => res.json())
            .then(dataArr => this.setState({timeSlotList: dataArr},()=>console.log('Slot list fetched..'
            ,dataArr)));

            var tempSlot;
            fetch("http://localhost:9000/getData/getScheduleData?dfolder="+dfolder+"&cfolder="+cfolder+"&execution="+sfolder)
            .then(res => res.json())
            .then(slots => tempSlot = slots)
            .then(()=>
              {
                console.log(tempSlot[0].slot);
                this.setState({scheduleSlots: tempSlot[0].slot});
               // const scheduleDiv = document.getElementById('scheduleview');
               // scheduleDiv.innerHTML = '<ScheduleView primary={true} slots={'+this.state.scheduleSlots[0].slot+'}/>';
                
            }
              );
              fetch("http://localhost:9000/getData/getSolutionVenueList?dfolder="+dfolder+"&cfolder="+cfolder)
              .then(res => res.json())
              .then(room => this.setState({rooms:room}));

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
    var genDate = sfolder.split("_")[1];
    var genTime = sfolder.split("_")[2];
    var genDay=genDate[4]+genDate[5];
    var genMonth=genDate[2]+genDate[3];
    var genYear=genDate[0]+genDate[1];
    var genHour=genTime[0]+genTime[1];
    var genMin=genTime[2]+genTime[3];
    var constraintFolder = cfolder;
    constraintFolder=constraintFolder.replace("%20"," ");
    var sem = constraintFolder.split('_')[0][constraintFolder.split('_')[0].length-1];
    var presentationName = constraintFolder.split('_')[1];
    var academicYear = dfolder.replace("-","/")
    const downloadPDF=()=>{
      var doc = new jsPDF();
      doc.text(15, 20, presentationName+' (Semester '+sem+', '+academicYear+')');
      doc.setFontSize(15);
      doc.text(15, 30, 'Individual Schedule');
      doc.setFontSize(15);
      doc.text(15, 40, 'Name: '+this.state.selectedStaff);
      doc.text(15, 50, 'Time generated: '+genDay+'/'+genMonth+'/'+genYear+' '+genHour+':'+genMin);
      doc.autoTable({html:'#masterScheduleTable',styles: { fontSize: 7 },startY:60});
      doc.setFontSize(9);
      doc.save(this.state.selectedStaff+'.pdf');
    }
    /*
                <ReactToPrint
                trigger={()=>{
                    return <Button onClick={downloadPDF}>Print</Button>
                }}
                content={()=>this.componentRef}
                documentTitle="Master Schedule"
                pageStyle="print"
                />
    */
   const submit=()=>{
    
    if(this.state.selectedStaff==="Please Select a Staff"||this.state.selectedStaff===''){
        alert("Please select a staff");
    }
    else{
        this.setState({showDiv:true});
        //fetch individual schedule
        fetch("http://localhost:9000/getData/getIndividualSchedule?dfolder="+dfolder+"&cfolder="+cfolder+"&sfolder="+sfolder+"&individual="+this.state.selectedStaff)
        .then(res => res.json())
        .then(results => this.setState({schedule: results},()=>console.log('Schedule fetched..'
        ,results)))
        .then(()=>{
            var tempIndex=[];
            for(let i=0;i<this.state.schedule.length;i++){
                tempIndex.push(this.state.schedule[i].index);
            }
            this.setState({index:tempIndex});
            console.log(tempIndex);
        });
    }
   }
   var visibilityState = this.state.showDiv ? "visible" : "hidden";
    return ( 
      <div>
      <form>
            <h3>Please select a staff</h3>
            <select id="staff-choice" onChange={()=>this.setState({selectedStaff:document.getElementById('staff-choice').value})}>
            <option>Please Select a Staff</option>
                {this.state.staffList.map(staff=>
                <option key="{staff}">
                    {staff.staffName}
                </option>)}
            </select>
            <Button  
                onClick={(e)=>{
                    e.preventDefault();
                    submit();
                }}>Select</Button>
        </form>
        <br/>
        <Button variant="secondary" onClick={()=>{window.location.href="/schedulemenu/"+folderID}}>Back</Button>
        <br/>
        <br/>
        <br/>
        <div style={{visibility:visibilityState}}>
        <ReactToPrint
            trigger={()=>{
                return <Button>Print</Button> 
            }}
            content={()=>this.componentRef}
            documentTitle={this.state.selectedStaff}
            pageStyle="print"
        />

            <div className='recordList' id='masterSchedule' ref={el=>(this.componentRef=el)}>
                <h3>{presentationName} (Semester {sem}, {academicYear})</h3>
                <h5>Individual Schedule</h5>
                <h5>Name: {this.state.selectedStaff}</h5>
                <h5>Time generated by scheduler: {genDay}/{genMonth}/{genYear} {genHour}:{genMin}</h5>

                <div id='scheduleview'>
                    <ReportScheduleView rooms={this.state.rooms} slots={this.state.scheduleSlots} slotList={this.state.timeSlotList} highlightedSlots={this.state.index}/>
                    <h5>***The highlighted IDs in the schedule indicate the presentation sessions which you need to attend as supervisor or examiner. </h5>
                <h5>***The details of each highlighted presentation are listed below </h5>
                </div>

                <br/>
                    <table id='masterScheduleTable'>
                        <thead>
                            <tr>
                                <th style={{ border: 'solid' }}>#</th>
                                <th style={{ border: 'solid' }}>Matric No</th>
                                <th style={{ border: 'solid' }}>Name</th>
                                <th style={{ border: 'solid' }}>Title</th>
                                <th style={{ border: 'solid' }}>Supervisor</th>
                                <th style={{ border: 'solid' }}>Examiner 1</th>
                                <th style={{ border: 'solid' }}>Examiner 2</th>
                                <th style={{ border: 'solid' }}>Time</th>
                                <th style={{ border: 'solid' }}>Venue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.schedule.map(presentation =>
                            <tr key="{presentation}">  
                                <td style={{ border: 'solid' }}>{presentation.index}</td>
                                <td style={{ border: 'solid' }}>{presentation.matricno}</td>
                                <td style={{ border: 'solid' }}>{presentation.studentname}</td>
                                <td style={{ border: 'solid' }}>{presentation.title}</td>
                                <td style={{ border: 'solid' }}>{presentation.supervisor}</td>
                                <td style={{ border: 'solid' }}>{presentation.examiner1}</td>
                                <td style={{ border: 'solid' }}>{presentation.examiner2}</td>
                                <td style={{ border: 'solid' }}>{presentation.time}</td>
                                <td style={{ border: 'solid' }}>{presentation.venue}</td>
                            </tr>
                            )}
                        </tbody>  
                    </table>
                </div>

        </div>
        
      </div>
  );
  }
}

export default IndividualSchedulePage;
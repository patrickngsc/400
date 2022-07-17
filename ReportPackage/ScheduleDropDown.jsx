import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import { VictoryBar, VictoryChart } from 'victory';
import { withRouter } from 'react-router-dom';
import './Style.css';
import { Button } from 'react-bootstrap';
const pathname = window.location.pathname;
class ScheduleDropDown extends React.Component{
    constructor(props){
        super(props);
        this.state={filenames:[],selectedFolder:'',filenames1:[],selectedFolder1:'',filenames2:[],selectedFolder2:'',showForm:false,showForm1:false};
    }
    callAPI(){
        fetch("http://localhost:9000/getData/getExistingDataFolder")
        .then(res => res.json())
        .then(results => this.setState({filenames: results},()=>console.log('Path fetched..'
        ,results)));
    }
    componentWillMount(){
        this.callAPI();
    }

    render() {
        const submit=()=>{
            if(this.state.selectedFolder==="Please Select Academic Year"||this.state.selectedFolder===''){
                alert("Please select folder");
            }
            else{
                alert("Folder Selected: "+this.state.selectedFolder);
                //choose schedule version
                fetch("http://localhost:9000/getData/getExistingConstraintFolder?folder="+this.state.selectedFolder)
                .then(res => res.json())
                .then(results => this.setState({filenames1: results},()=>console.log('Path fetched..'
                ,results)))
                .then(this.setState({showForm:true}));
            }
        }

        const submit1=()=>{
            if(this.state.selectedFolder1==="Please Select Constraint Folder"||this.state.selectedFolder1===''){
                alert("Please select schedule version");
            }
            else{
                alert("Folder Selected: "+this.state.selectedFolder1);
                //choose schedule version
                fetch("http://localhost:9000/getData/getScheduleVersions?dfolder="+this.state.selectedFolder+"&cfolder="+this.state.selectedFolder1)
                .then(res => res.json())
                .then(results => this.setState({filenames2: results},()=>console.log('Path fetched..'
                ,results)))
                .then(this.setState({showForm1:true}));
                
            }
        }
        const submit2=()=>{
            if(this.state.selectedFolder2==="Please Select Schedule Version"||this.state.selectedFolder2===''){
                alert("Please select schedule version");
            }
            else{
                fetch("http://localhost:9000/setData/setScheduleOutput?dfolder="+this.state.selectedFolder+"&cfolder="+this.state.selectedFolder1+"&sfolder="+this.state.selectedFolder2)
            .then(res => res.text())
            .then(results => {
                alert("Version Selected: "+this.state.selectedFolder2);
                window.location.href='schedulemenu/'+this.state.selectedFolder+'+'+this.state.selectedFolder1+'+'+this.state.selectedFolder2;
            });
                
            }
        }
        var visibilityState = this.state.showForm ? "visible" : "hidden";
        var visibilityState1 = this.state.showForm1 ? "visible" : "hidden";
        return (
        <div>
        <form>
            <h3>Please select academic year</h3>
            <select id="folder-choice" onChange={()=>this.setState({selectedFolder:document.getElementById('folder-choice').value})}>
            <option>Please Select Academic Year</option>
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
        <form style={{visibility:visibilityState}}>
            <h3>Please select constraint folder</h3>
            <select id="folder-choice1" onChange={()=>this.setState({selectedFolder1:document.getElementById('folder-choice1').value})}>
            <option>Please Select Constraint Folder</option>
                {this.state.filenames1.map(filename=>
                <option key="{filename}">
                    {filename.filename}
                </option>)}
            </select>
            <Button  
                onClick={(e)=>{
                    e.preventDefault();
                    submit1();
                }}>Select</Button>
        </form>
        <br/>
        <form style={{visibility:visibilityState1}}>
            <h3>Please select schedule version</h3>
            <select id="folder-choice2" onChange={()=>this.setState({selectedFolder2:document.getElementById('folder-choice2').value})}>
            <option>Please Select Schedule Version</option>
                {this.state.filenames2.map(filename=>
                <option key="{filename}">
                    {filename.filename}
                </option>)}
            </select>
            <Button  
                onClick={(e)=>{
                    e.preventDefault();
                    submit2();
                }}>Select</Button>
        </form>
        </div>
        );
    }
    
}

export default ScheduleDropDown;
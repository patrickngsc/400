import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import { VictoryBar, VictoryChart } from 'victory';
import { withRouter } from 'react-router-dom';
import './Style.css';
import { Button } from 'react-bootstrap';
const pathname = window.location.pathname;
class ExistingConstraintSection extends React.Component{
    constructor(props){
        super(props);
        this.state={filenames:[],selectedFolder:'',filenames1:[],selectedFolder1:'',showForm:false};
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
            if(this.state.selectedFolder==="Please Select Input Folder"||this.state.selectedFolder===''){
                alert("Please select input folder");
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
                alert("Please select constraint folder");
            }
            else{
                alert("Folder Selected: "+this.state.selectedFolder1);
                window.location.href='dataoptionview/'+this.state.selectedFolder+'+'+this.state.selectedFolder1; 
            }
        }
        var visibilityState = this.state.showForm ? "visible" : "hidden";
        return (
        <div>
        <form>
            <h3>Please select input folder</h3>
            <select id="folder-choice" onChange={()=>this.setState({selectedFolder:document.getElementById('folder-choice').value})}>
            <option>Please Select Input Folder</option>
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
        </div>
        );
    }
    
}

export default ExistingConstraintSection;
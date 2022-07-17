import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import { VictoryBar, VictoryChart } from 'victory';
import { withRouter } from 'react-router-dom';
import './Style.css';
import { Button, Modal, Overlay, OverlayTrigger, Table } from 'react-bootstrap';
const pathname = window.location.pathname;
class ExistingDataSection extends React.Component{
    constructor(props){
        super(props);
        this.state={filenames:[],selectedFolder:''};
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
            if(this.state.selectedFolder==="Please Select Folder"||this.state.selectedFolder===''){
                alert("Please select folder");
            }
            else{
                alert("Folder Selected: "+this.state.selectedFolder);
                window.location.href='dataoptionedit/'+this.state.selectedFolder;
            }
        }
        console.log(this.state.filenames)
        return (
        <div>
        <form>
            <h3>Please select a folder</h3>
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
            
        </div>
        );
    }
    
}

export default ExistingDataSection;
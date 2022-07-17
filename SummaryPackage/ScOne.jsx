import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import { VictoryBar, VictoryChart } from 'victory';
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom';
import './Style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Button } from 'react-bootstrap';
class ScOne extends React.Component{
    constructor(props){
        super(props);
        this.state={staffsMaxSlots:[]};
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
            fetch("http://localhost:9000/getData/getSC01?dfolder="+dataFolderID+"&cfolder="+constraintFolderID)
            .then(res => res.json())
            .then(staffsMaxSlots => this.setState({staffsMaxSlots: staffsMaxSlots},()=>console.log('SC1 fetched..'
            ,staffsMaxSlots)));
    }
    componentWillMount(){
        this.callAPI();
    }

    render() {
        console.log(this.state.presentations);
        const splitUrl = window.location.href.split("/");
        return ( <div>
        <h2>SC01 - Maximum Number of Slots Attended by Staffs</h2>
        <Button variant="secondary" onClick={()=>{window.location.href="/dataoptionview/"+splitUrl[splitUrl.length-1]}}>Back</Button>
            <div className='recordList'>
                <table>
                    <thead>
                        <tr>
                            <th style={{ border: 'solid' }}>Staff</th>
                            <th style={{ border: 'solid' }}>Maximum Consecutive Slots</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.staffsMaxSlots.map(staffSlot =>
                        <tr key="{staff}">  
                            <td style={{ border: 'solid' }}>{staffSlot.staff}</td>
                            <td style={{ border: 'solid' }}>{staffSlot.maxConsecutiveSlots}</td>
                        </tr>
                        )}
                    </tbody>  
                </table>
            </div>
            </div>
        );
    }
}

export default ScOne;
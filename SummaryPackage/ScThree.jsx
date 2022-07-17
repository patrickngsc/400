import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import { VictoryBar, VictoryChart } from 'victory';
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom';
import './Style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Button } from 'react-bootstrap';
class ScThree extends React.Component{
    constructor(props){
        super(props);
        this.state={staffsVenueChanges:[]};
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
            fetch("http://localhost:9000/getData/getSC03?dfolder="+dataFolderID+"&cfolder="+constraintFolderID)
            .then(res => res.json())
            .then(staffsVenueChanges => this.setState({staffsVenueChanges: staffsVenueChanges},()=>console.log('SC3 fetched..'
            ,staffsVenueChanges)));
    }
    componentWillMount(){
        this.callAPI();
    }

    render() {
        console.log(this.state.presentations);
        const splitUrl = window.location.href.split("/");
        return ( <div>
        <h2>SC03 - Preference of Remaining in the Same Venue by Staffs (For Consecutive Slots)</h2>
        <Button variant="secondary" onClick={()=>{window.location.href="/dataoptionview/"+splitUrl[splitUrl.length-1]}}>Back</Button>
    
            <div className='recordList'>
                <table>
                    <thead>
                        <tr>
                            <th style={{ border: 'solid' }}>Staff</th>
                            <th style={{ border: 'solid' }}>Change Venue or not</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.staffsVenueChanges.map(staffVenueChange =>
                        <tr key="{staffVenueChange}">  
                            <td style={{ border: 'solid' }}>{staffVenueChange.staff}</td>
                            <td style={{ border: 'solid' }}>{staffVenueChange.changevenue}</td>
                        </tr>
                        )}
                    </tbody>  
                </table>
            </div>
            </div>
        );
    }
}

export default ScThree;
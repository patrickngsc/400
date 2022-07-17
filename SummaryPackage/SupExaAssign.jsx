import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import { VictoryBar, VictoryChart } from 'victory';
import {Link, useParams} from 'react-router-dom';
import './Style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Button } from 'react-bootstrap';
class SupExaAssign extends React.Component{
    constructor(props){
        super(props);
        this.state={presentations:[]};
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
            fetch("http://localhost:9000/getData/getSupExaAssign?dfolder="+dataFolderID+"&cfolder="+constraintFolderID)
            .then(res => res.json())
            .then(presentations => this.setState({presentations: presentations},()=>console.log('Presentations fetched..'
            ,presentations)));
    }
    componentWillMount(){
        this.setState({presentations: []});
        this.callAPI();
    }

    render() {
        console.log(this.state.presentations);
        const splitUrl = window.location.href.split("/");
        if(this.state.presentations.length===0){
            return (<div></div>)
        }
        else{
            return ( <div>
            <h2>Presentation List</h2>
            <Button variant="secondary" onClick={()=>{window.location.href="/dataoptionview/"+splitUrl[splitUrl.length-1]}}>Back</Button>
            <div className='recordList'>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col" style={{ border: 'solid' }}>Presentation</th>
                                <th scope="col" style={{ border: 'solid' }}>Supervisor</th>
                                <th scope="col" style={{ border: 'solid' }}>Examiner1</th>
                                <th scope="col" style={{ border: 'solid' }}>Examiner2</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.presentations.map(presentation =>
                            <tr key="{presentation}">  
                                <td style={{ border: 'solid' }}>{presentation.presentation}</td>
                                <td style={{ border: 'solid' }}>{presentation.supervisor}</td>
                                <td style={{ border: 'solid' }}>{presentation.examiner1}</td>
                                <td style={{ border: 'solid' }}>{presentation.examiner2}</td></tr>
                            )}
                        </tbody>  
                    </table>
                </div>
                </div>
            );}
    }
}

export default SupExaAssign;
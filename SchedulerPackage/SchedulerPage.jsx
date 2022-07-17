import React, { useState, useEffect } from 'react';
import { csv } from 'd3';
import { VictoryBar, VictoryChart } from 'victory';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './Style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Button } from 'react-bootstrap';
const sampleData = [
    { staff: "S001", maximumNumberOfDays: 3 },
    { staff: "S002", maximumNumberOfDays: 4 },
    { staff: "S003", maximumNumberOfDays: 5 }
];

class SchedulerPage extends React.Component {
    render() {
        const submit = () => {
            fetch("http://localhost:9000/GeneticAlgorithm/exeScheduler")
                .then(res => res.json());
        }
        return ( <div>

            <div>
            <h3> Genetic Algorithm Presentation Scheduler </h3> 
            <ol>
            <li> Click "Launch Scheduler" button to open the scheduler application. </li> 
            <li> Click "Read" button. </li> 
            <li> Navigate to "routes/dataFolder/Data/AcademicYear". Sample AcademicYear is "2019-2020"</li>
            <li> Choose the folder with naming convention "Sem_PresentationName_Constraints_DateTime". </li>
            <li> Edit parameter fields if needed. </li> 
            <li> Click "Run" button. </li> 
            <li> After scheduling is done, a folder containing result and execution history is stored under the folder read. </li> 
            </ol> 
            </div> 
            <br/>
            <Button onClick = { submit }> Launch Scheduler </Button> 
            <br/>
            <br/>
            <Button variant="secondary" onClick={()=>{window.location.href="/home"}}>Back</Button>
            </div>
        );
    }
}

export default SchedulerPage;
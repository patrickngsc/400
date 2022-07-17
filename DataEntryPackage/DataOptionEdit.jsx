import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import {BrowserRouter,Routes,Route,Link, useParams} from 'react-router-dom';
import { CSVLink } from 'react-csv';
import './Style.css';
import { Button, Container, Dropdown, DropdownButton, Form, Modal, Table } from 'react-bootstrap';

class DataOptionEdit extends React.Component{
  constructor(props){
    super(props);
    this.state={dataArr:[],showModal:false,presentationName:"",sem:"1"};
}
callAPI(){ 
        const splitUrl = window.location.href.split("/");
        const folderID = splitUrl[splitUrl.length-1];
        fetch("http://localhost:9000/getData/getDataFromExcel?folder="+folderID)
        .then(res => res.json())
            .then(dataArr => this.setState({dataArr: dataArr},()=>console.log('Data fetched..'
            ,dataArr)));
}
  componentWillMount(){
      this.callAPI();
  }

  render(){

    //<CSVLink {...csvReport }> Export to CSV </CSVLink> to be added
    const splitUrl = window.location.href.split("/");
    const folderID = splitUrl[splitUrl.length-1];
    const handleModal=()=>{
      this.setState({showModal:!this.state.showModal});
    }
    const setConstraintFolder = () =>{
      if(this.state.presentationName===""){
        alert("Field cannot be empty.")
        return
      }
      fetch("http://localhost:9000/setData/setConstraintFolder?folder="+folderID+"&sem="+this.state.sem+"&presentation="+this.state.presentationName)
        .then(res => res.text())
        .then(result => alert("Folder created. Directory:"+result));
    }
    return ( 
      <div>
       <h3>Folder name: {folderID}</h3>
        <div>
        <ul className="list-group">
            <li className="list-group-item"><Link to={"/stafflistpage/"+folderID} className='nav-link' style={{ textDecoration: 'none' }}>Staff List</Link></li>
            <li className="list-group-item"><Link to={"/studentlistpage/"+folderID} className='nav-link' style={{ textDecoration: 'none' }}>Student List</Link></li>
            <li className="list-group-item"><Link to={"/venuelistpage/"+folderID} className='nav-link' style={{ textDecoration: 'none' }}>Venue List</Link></li>
          </ul>
          <br/>
          <h5>To generate a schedule, the "Finalise" button have to be clicked.</h5>
          <Button onClick={handleModal}>Finalise</Button>
          <Modal show={this.state.showModal}>
              <Modal.Header>Finalise</Modal.Header>
              <Modal.Body>
                  <Container fluid>
                  <Form>
                    <Form.Group controlId='Semester'>
                    <Form.Label>Semester</Form.Label>
                    <Form.Control aria-label="Default select example" as="select" onChange={e=>this.setState({sem:e.target.value})}>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                    </Form.Control>
                  </Form.Group>
                  <br/>
                    <Form.Group>
                      <Form.Label>Presentation Name</Form.Label>
                      <Form.Control placeholder="Type presentation name here." onChange={(e)=>{this.setState({presentationName:e.target.value})}}></Form.Control>
                    </Form.Group>
                </Form>
                  </Container>
                  <br/>
                  <Button onClick={setConstraintFolder}>Submit</Button>
              </Modal.Body>
              <Modal.Footer>
                    <Button onClick={handleModal}>Close</Button>
              </Modal.Footer>
          </Modal>
        </div>
        <br/>
        <Button variant="secondary" onClick={()=>{window.location.href="/EditInfoPage"}}>Back</Button>
     
      </div>
  );
  }
}

export default DataOptionEdit;
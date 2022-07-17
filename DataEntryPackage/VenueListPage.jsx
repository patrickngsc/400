import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import {BrowserRouter,Routes,Route,Link, useParams} from 'react-router-dom';
import { CSVLink } from 'react-csv';
import './Style.css';
import ReactHtmlParser from "react-html-parser";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Button, Container, Dropdown, DropdownButton, Form, Modal, Table } from 'react-bootstrap';
import TimetableInterface from './TimetableInterface';
import ScheduleInterface from './ScheduleInterface';
const days=['Mon','Tue','Wed','Thu','Fri'];
class VenueListPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {showAdd: false,showEdit: false,showDelete: false,showVenueModal:false,selectedVenue:"",venueList:[],slotList:[],schedule:"",addName:""}
}
callAPI(){
    const splitUrl = window.location.href.split("/");
    const folderID = splitUrl[splitUrl.length-1];
    fetch("http://localhost:9000/getData/getVenueList?folder="+folderID)
    .then(res => res.json())
        .then(dataArr => this.setState({venueList: dataArr},()=>console.log('Venue list fetched..'
        ,dataArr))).then(()=>{
            console.log(this.state.venueList)
        });
        fetch("http://localhost:9000/getData/getSlotList?folder="+folderID)
    .then(res => res.json())
        .then(dataArr => this.setState({slotList: dataArr},()=>console.log('Slot list fetched..'
        ,dataArr)));
}
componentWillMount(){
    this.callAPI();
}
  render(){
    const handleAddFormModal=()=>{
        this.setState({showAdd:!this.state.showAdd})
    }
    const submitAddVenue=()=>{
        if(this.state.addName.length===0 ){
            alert("Fields cannot be empty");
            return
        }else{
            fetch("http://localhost:9000/setData/addVenue?folder="+folderID+"&name="+this.state.addName)
            .then(res => res.text())
            .then(result=>alert("Venue added: "+result+"\nRefresh the page to view the changes."));
        }
    }
    const handleEditFormModal=()=>{
        this.setState({showEdit:!this.state.showEdit})
    }
    const handleDeleteModal=()=>{
        this.setState({showDelete:!this.state.showDelete})
    }
    const openVenueModal=(venue)=>{
        this.setState({showVenueModal:true})
        this.setState({selectedVenue:venue.venue})
    }
    const closeVenueModal=()=>{
        this.setState({showVenueModal:false})
        this.setState({selectedVenue:""})
    }
    const confirmDelete=()=>{
        fetch("http://localhost:9000/setData/delVenue?folder="+folderID+"&venue="+this.state.selectedVenue)
        .then(res => res.text())
            .then(result =>{
                 alert(result+"\nRefresh the page to view the changes.");
                 this.setState({showDelete:!this.state.showDelete});
                 this.setState({showVenueModal:false});
                });
    }
    const splitUrl = window.location.href.split("/");
    const folderID = splitUrl[splitUrl.length-1];
    return ( 
      <div>
      <h2>Venue List</h2>
      <br/>
        <div>
          <Button onClick={handleAddFormModal}>Add Venue</Button>
          <Button variant="secondary" onClick={()=>{window.location.href="/dataoptionedit/"+folderID}}>Back</Button>
          <br/>
          <Modal show={this.state.showAdd}>
              <Modal.Header>Add Venue</Modal.Header>
              <Modal.Body>
                  <Container fluid>
                    <Form>
                        <Form.Group>
                            <Form.Label>Venue Name</Form.Label>
                            <Form.Control name="name" placeholder="Type venue name here" onChange={(e)=>{this.setState({addName:e.target.value})}}></Form.Control>
                        </Form.Group>
                    </Form>
                  </Container>
                  <br/>
                  <Button onClick={submitAddVenue}>Submit</Button>
              </Modal.Body>
              <Modal.Footer>
                    <Button onClick={handleAddFormModal}>Close</Button>
              </Modal.Footer>
          </Modal>
        </div>
        <Table bordered hover>
                    <thead>
                        <tr>
                            <th style={{ border: 'solid' }}>No.</th>
                            <th style={{ border: 'solid' }}>Venue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.venueList.map(venue =>
                            <tr key="{venue}" onClick={()=>openVenueModal(venue)}>
                                <td style={{ border: 'solid' }}>{(this.state.venueList.indexOf(venue)+1)}</td>
                                <td style={{ border: 'solid' }}>{venue.venue}</td>
                            </tr>
                        )}
                    </tbody>  
                </Table>
          <Modal show={this.state.showVenueModal} size='xl'>
              <Modal.Header>{this.state.selectedVenue}</Modal.Header>
              <Modal.Body>
                  <ScheduleInterface group="Venue" individual={this.state.selectedVenue} slots={this.state.slotList}></ScheduleInterface>
                  <Modal show={this.state.showDelete} size='xl'>
                        <Modal.Header>Delete Venue Confirmation</Modal.Header>
                        <Modal.Body>
                            <h4>Do you confirm to delete {this.state.selectedVenue}? Deleted data cannot be recovered.</h4>
                            <h5>Click Yes to confirm deletion. Click close to deny deletion and close the tab.</h5>
                            <br/>
                            <Button variant="danger" onClick={confirmDelete}>Yes</Button>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={handleDeleteModal}>Close</Button>
                        </Modal.Footer>
                    </Modal>
              </Modal.Body>
              <Modal.Footer>
              <div>
              <Button variant="danger" className="m-3" onClick={handleDeleteModal}>Delete Venue</Button>
                  <Button  onClick={closeVenueModal}>Close</Button></div>
                
              </Modal.Footer>
          </Modal>
      </div>
  );
  }
}

export default VenueListPage;
import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import {BrowserRouter,Routes,Route,Link, useParams} from 'react-router-dom';
import { CSVLink } from 'react-csv';
import './Style.css';
import ReactHtmlParser from "react-html-parser";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Button, Container, Dropdown, DropdownButton, Form, Modal, Table } from 'react-bootstrap';
import ScheduleInterface from './ScheduleInterface';
import { getElementError } from '@testing-library/react';
class StaffListPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {showAdd: false,showEdit: false,showDelete: false,showStaffModal:false,selectedStaff:""
    , staffList:[],slotList:[],schedule:"",addName:"",addTitle:""}
    }
    callAPI(){
        const splitUrl = window.location.href.split("/");
        const folderID = splitUrl[splitUrl.length-1];
        fetch("http://localhost:9000/getData/getStaffList?folder="+folderID)
        .then(res => res.json())
            .then(dataArr => this.setState({staffList: dataArr},()=>console.log('Sfaff list fetched..'
            ,dataArr))).then(()=>{
                console.log(this.state.staffList)
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
    const handleEditFormModal=()=>{
        this.setState({showEdit:!this.state.showEdit})
    }
    const handleDeleteModal=()=>{
        this.setState({showDelete:!this.state.showDelete})
    }
    const confirmDelete=()=>{
        fetch("http://localhost:9000/setData/delStaff?folder="+folderID+"&name="+this.state.selectedStaff)
        .then(res => res.json())
            .then(result =>{
                console.log(result)
                if(result.length!==0){
                    var alertString = "Delete failed. This is because the staff is involved in the following presentations:"
                    for(let i=0;i<result.length;i++){
                        alertString+="\n"+(i+1).toString()+". "+result[i][2];
                    }
                    alertString+="\nPlease replace the staff with others before deleting. ";
                    alert(alertString);
                }
                else{
                    alert("Staff deleted. \nRefresh the page to view the changes.");
                }
                this.setState({showDelete:!this.state.showDelete});
                this.setState({showStaffModal:false});
                });
    }
    const openStaffModal=(staff)=>{
        this.setState({showStaffModal:true});
        this.setState({selectedStaff:staff.staffName});
        fetch("http://localhost:9000/getData/getConSlot?folder="+folderID+"&individual="+staff.staffName)
        .then(res =>  res.text())
        .then(conSlot => document.getElementById("dropdown-conslot").innerHTML = conSlot);
        fetch("http://localhost:9000/getData/getNumDay?folder="+folderID+"&individual="+staff.staffName)
        .then(res => res.text())
        .then(numDay => document.getElementById("dropdown-numday").innerHTML = numDay);
        fetch("http://localhost:9000/getData/getRemainVenue?folder="+folderID+"&individual="+staff.staffName)
        .then(res => res.text())
        .then(remainVenue => document.getElementById("dropdown-remainvenue").innerHTML = remainVenue);
    }
    const closeStaffModal=()=>{
        this.setState({showStaffModal:false});
        this.setState({selectedStaff:""});
    }
    const submitAddStaff=()=>{
        if(this.state.addName.length===0 ||this.state.addTitle.length===0 ){
            alert("Fields cannot be empty");
            return
        }else{
            fetch("http://localhost:9000/setData/addStaff?folder="+folderID+"&name="+this.state.addName+"&title="+this.state.addTitle)
            .then(res => res.json())
            .then(result=>alert("Staff added.\nName: "+result[0]+"\nInitial: "+result[1]+"\nRefresh the page to view the changes."));
        }
    }
    const handleConSlot=(e)=>{
        document.getElementById("dropdown-conslot").innerHTML = e;
        fetch("http://localhost:9000/setData/setConSlot?folder="+folderID+"&individual="+this.state.selectedStaff+"&conSlot="+e)
            .then(res => console.log("successfully set conslot"));
    }
    const handleNumDay=(e)=>{
        document.getElementById("dropdown-numday").innerHTML = e;
        fetch("http://localhost:9000/setData/setNumDay?folder="+folderID+"&individual="+this.state.selectedStaff+"&numDay="+e)
            .then(res => console.log("successfully set numday"));
    }
    const handleRemainVenue=(e)=>{
        document.getElementById("dropdown-remainvenue").innerHTML = e;
        fetch("http://localhost:9000/setData/setRemainVenue?folder="+folderID+"&individual="+this.state.selectedStaff+"&remain="+e)
            .then(res => console.log("successfully set remainvenue"));
    }
    const splitUrl = window.location.href.split("/");
    const folderID = splitUrl[splitUrl.length-1];
    return ( 
      <div>
      <h2>Staff List</h2>
      <br/>
        <div>
          <Button onClick={handleAddFormModal}>Add Staff</Button>
          <Button variant="secondary" onClick={()=>{window.location.href="/dataoptionedit/"+folderID}}>Back</Button>
          <br/>
          <Modal show={this.state.showAdd}>
              <Modal.Header>Add Staff</Modal.Header>
              <Modal.Body>
                  <Container fluid>
                    <Form>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control name="name" placeholder="Type staff name here" onChange={(e)=>{this.setState({addName:e.target.value})}}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Title, Example: Dr., Associate Professor Dr., Mr., Mrs., Ms</Form.Label>
                            <Form.Control name="title" placeholder="Type title here" onChange={(e)=>{this.setState({addTitle:e.target.value})}}></Form.Control>
                        </Form.Group>
                    </Form>
                  </Container>
                  <br/>
                  <Button onClick={submitAddStaff}>Submit</Button>
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
                            <th style={{ border: 'solid' }}>Staff</th>
                            <th style={{ border: 'solid' }}>Abbreviation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.staffList.map(staff =>
                        <tr key="{staffName}" onClick={()=>openStaffModal(staff)}>
                        <td style={{ border: 'solid' }}>{(this.state.staffList.indexOf(staff)+1)}</td>
                            <td style={{ border: 'solid' }}>{staff.staffName}</td>
                            <td style={{ border: 'solid' }}>{staff.abbreviation}</td>
                        </tr>
                        )}
                    </tbody>  
                </Table>
                <Modal show={this.state.showStaffModal} size='xl'>
              <Modal.Header>{this.state.selectedStaff}</Modal.Header>
              <Modal.Body>
                  <ScheduleInterface group="Staff" individual={this.state.selectedStaff} slots={this.state.slotList}></ScheduleInterface>
                  <br/>
                  <br/>
                  <h5>Preferred Number of Consecutive Slots having Presentations</h5>
                  <Dropdown onSelect={handleConSlot}>
                    <Dropdown.Toggle variant="success" id="dropdown-conslot">
                        Dropdown Button
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="1">1</Dropdown.Item>
                        <Dropdown.Item eventKey="2">2</Dropdown.Item>
                        <Dropdown.Item eventKey="3">3</Dropdown.Item>
                        <Dropdown.Item eventKey="4">4</Dropdown.Item>
                        <Dropdown.Item eventKey="5">5</Dropdown.Item>
                        <Dropdown.Item eventKey="6">6</Dropdown.Item>
                        <Dropdown.Item eventKey="7">7</Dropdown.Item>
                        <Dropdown.Item eventKey="8">8</Dropdown.Item>
                        <Dropdown.Item eventKey="9">9</Dropdown.Item>
                        <Dropdown.Item eventKey="10">10</Dropdown.Item>
                        <Dropdown.Item eventKey="11">11</Dropdown.Item>
                        <Dropdown.Item eventKey="12">12</Dropdown.Item>
                        <Dropdown.Item eventKey="13">13</Dropdown.Item>
                        <Dropdown.Item eventKey="14">14</Dropdown.Item>
                        <Dropdown.Item eventKey="15">15</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <br/>
                  <br/>
                  <h5>Preferred Number of Days having Presentations</h5>
                  <Dropdown onSelect={handleNumDay}>
                    <Dropdown.Toggle variant="success" id="dropdown-numday">
                        Dropdown Button
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="1">1</Dropdown.Item>
                        <Dropdown.Item eventKey="2">2</Dropdown.Item>
                        <Dropdown.Item eventKey="3">3</Dropdown.Item>
                        <Dropdown.Item eventKey="4">4</Dropdown.Item>
                        <Dropdown.Item eventKey="5">5</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <br/>
                  <br/>
                  <h5>Preferred Remaining in the Same Venue for Consecutive Slots</h5>
                  <Dropdown onSelect={handleRemainVenue}>
                    <Dropdown.Toggle variant="success" id="dropdown-remainvenue">
                        Dropdown Button
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="yes">yes</Dropdown.Item>
                        <Dropdown.Item eventKey="no">no</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  <Modal show={this.state.showDelete} size='xl'>
                        <Modal.Header>Delete Venue Confirmation</Modal.Header>
                        <Modal.Body>
                            <h4>Do you confirm to delete {this.state.selectedStaff}? Deleted data cannot be recovered.</h4>
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
                    <Button variant="danger" className="m-3" onClick={handleDeleteModal}>Delete Staff</Button>
                    <Button onClick={closeStaffModal}>Close</Button>
                </div>
                  
              </Modal.Footer>
          </Modal>
      </div>
  );
  }
}

export default StaffListPage;
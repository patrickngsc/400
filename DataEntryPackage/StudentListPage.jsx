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
class StudentListPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {showAdd: false,showEdit: false,showDelete: false,showStudentModal:false,
        selectedStudent:"",selectedMatricNo:"",selectedTitle:"",selectedSv:"",selectedExOne:"",selectedExTwo:"",
         studentList:[],slotList:[],staffList:[],schedule:"",
        addMatricNo:"",addName:"",addTitle:"",addSv:"Select Supervisor",addExOne:"Select Examiner 1",addExTwo:"Select Examiner 2",
        editTitle:"", editSv:"Select Supervisor", editExOne:"Select Examiner 1", editExTwo:"Select Examiner 2"}
}
callAPI(){
    const splitUrl = window.location.href.split("/");
    const folderID = splitUrl[splitUrl.length-1];
    fetch("http://localhost:9000/getData/getStudentList?folder="+folderID)
    .then(res => res.json())
        .then(dataArr => this.setState({studentList: dataArr},()=>console.log('Student list fetched..'
        ,dataArr))).then(()=>{
            console.log(this.state.studentList)
        });
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
    const submitAddStudent=()=>{
        console.log(this.state.addMatricNo)
        console.log(this.state.addName)
        console.log(this.state.addTitle)
        console.log(this.state.addSv)
        console.log(this.state.addExOne)
        console.log(this.state.addExTwo)
        if(this.state.addMatricNo.length===0 || this.state.addName.length===0 ||this.state.addTitle.length===0 
        ||this.state.addSv==="Select Supervisor" ||this.state.addExOne==="Select Examiner 1" ||this.state.addExTwo==="Select Examiner 2"){
            alert("Inputs cannot be empty");
            return
        }else{
            if(this.state.addSv===this.state.addExOne||this.state.addSv===this.state.addExTwo
                ||this.state.addExTwo===this.state.addExOne){
                alert("A lecturer can only have 1 role per presentation.");
                return
            }
            fetch("http://localhost:9000/setData/addStudent?folder="+folderID+"&matricno="+this.state.addMatricNo
            +"&name="+this.state.addName+"&title="+this.state.addTitle+"&sv="+this.state.addSv+"&exone="+this.state.addExOne
            +"&extwo="+this.state.addExTwo)
            .then(res => res.json())
            .then(result=>alert("Student added.\nMatric No.: "+result[0]+"\nName: "+result[1]
            +"\nTitle: "+result[2]+"\nSupervisor: "+result[3]+"\nExaminer 1: "+result[4]+"\nExaminer 2: "+result[5]
            +"\nRefresh the page to view the changes."));
        }
    }
    const openEditModal=()=>{
        this.setState({showEdit:true});
        this.setState({editTitle:this.state.selectedTitle});
        this.setState({editSv:this.state.selectedSv});
        this.setState({editExOne:this.state.selectedExOne});
        this.setState({editExTwo:this.state.selectedExTwo});
    }
    const closeEditModal=()=>{
        this.setState({showEdit:false});
        this.setState({editTitle:""});
        this.setState({editSv:""});
        this.setState({editExOne:""});
        this.setState({editExTwo:""});
    }
    const submitEditStudent=()=>{
        console.log(this.state.editTitle)
        console.log(this.state.editSv)
        console.log(this.state.editExOne)
        console.log(this.state.editExTwo)
        if(this.state.editTitle.length===0 ||this.state.editSv==="Select Supervisor" ||this.state.editExOne==="Select Examiner 1" ||this.state.editExTwo==="Select Examiner 2"){
            alert("Inputs cannot be empty");
            return
        }else{
            if(this.state.editSv===this.state.editExOne||this.state.editSv===this.state.editExTwo
                ||this.state.editExTwo===this.state.editExOne){
                alert("A lecturer can only have 1 role per presentation.");
                return
            }
            fetch("http://localhost:9000/setData/editStudent?folder="+folderID+"&matricno="+this.state.selectedMatricNo
            +"&name="+this.state.selectedStudent+"&title="+this.state.editTitle+"&sv="+this.state.editSv+"&exone="+this.state.editExOne
            +"&extwo="+this.state.editExTwo)
            .then(res => res.json())
            .then(result=>{
                if(result.length!==0){
                alert("Info edited.\nTitle: "+result[0]+"\nSupervisor: "+result[1]+"\nExaminer 1: "+result[2]+"\nExaminer 2: "+result[3]
            +"\nRefresh the page to view the changes.")
                    }
                }
        );
        }
    }

    const handleDeleteModal=()=>{
        this.setState({showDelete:!this.state.showDelete})
    }
    const openStudentModal=(student)=>{
        this.setState({showStudentModal:true})
        this.setState({selectedStudent:student.studentName})
        this.setState({selectedMatricNo:student.matricNo})
        this.setState({selectedTitle:student.presentationTitle})
        this.setState({selectedSv:student.supervisor})
        this.setState({selectedExOne:student.examiner1})
        this.setState({selectedExTwo:student.examiner2})
    }
    const closeStudentModal=()=>{
        this.setState({showStudentModal:false})
        this.setState({selectedStudent:""})
        this.setState({selectedMatricNo:""})
    }
    const confirmDelete=()=>{
        //fetch with folderIDs and student name
        fetch("http://localhost:9000/setData/delStudent?folder="+folderID+"&matricno="+this.state.selectedMatricNo)
    .then(res => res.text())
        .then(result =>{
             alert(result+"\nRefresh the page to view the changes.");
             this.setState({showDelete:!this.state.showDelete});
             this.setState({showStudentModal:false});
            });
    }
    const splitUrl = window.location.href.split("/");
    const folderID = splitUrl[splitUrl.length-1];
    return ( 
      <div>
        <h2>Student List</h2>
        <div>
        <br/>
          <Button onClick={handleAddFormModal}>Add Student</Button>
          <Button variant="secondary" onClick={()=>{window.location.href="/dataoptionedit/"+folderID}}>Back</Button>
          <br/>
          <Modal show={this.state.showAdd}>
              <Modal.Header>Add Student</Modal.Header>
              <Modal.Body>
                  <Container fluid>
                    <Form>
                        <Form.Group>
                            <Form.Label>Matric No.</Form.Label>
                            <Form.Control name="matricno" placeholder="Type matric no. here" onChange={(e)=>{this.setState({addMatricNo:e.target.value})}}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control name="name" placeholder="Type name here" onChange={(e)=>{this.setState({addName:e.target.value})}}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control name="title" placeholder="Type title here" onChange={(e)=>{this.setState({addTitle:e.target.value})}}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Supervisor</Form.Label>
                            <Form.Control aria-label="Default select example" as="select" onChange={(e)=>this.setState({addSv:e.target.value})}>
                                <option value="1">Select Supervisor</option>
                                {this.state.staffList.map(staff =>
                                    <option value={staff.staffName}>{staff.staffName}</option>
                                    )}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Examiner 1</Form.Label>
                            <Form.Control aria-label="Default select example" as="select" onChange={(e)=>this.setState({addExOne:e.target.value})}>
                                <option value="1">Select Examiner 1</option>
                                {this.state.staffList.map(staff =>
                                    <option value={staff.staffName}>{staff.staffName}</option>
                                    )}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Examiner 2</Form.Label>
                            <Form.Control aria-label="Default select example" as="select" onChange={(e)=>this.setState({addExTwo:e.target.value})}>
                                <option value="1">Select Examiner 2</option>
                                {this.state.staffList.map(staff =>
                                    <option value={staff.staffName}>{staff.staffName}</option>
                                    )}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                  </Container>
                  <br/>
                  <Button onClick={submitAddStudent}>Submit</Button>
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
                            <th style={{ border: 'solid' }}>Matric No.</th>
                            <th style={{ border: 'solid' }}>Name</th>
                            <th style={{ border: 'solid' }}>Title</th>
                            <th style={{ border: 'solid' }}>Supervisor</th>
                            <th style={{ border: 'solid' }}>Examiner 1</th>
                            <th style={{ border: 'solid' }}>Examiner 2</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.studentList.map(student =>
                        <tr key="{studentName}" onClick={()=>openStudentModal(student)}>
                        <td style={{ border: 'solid' }}>{(this.state.studentList.indexOf(student)+1)}</td>
                            <td style={{ border: 'solid' }}>{student.matricNo}</td>
                            <td style={{ border: 'solid' }}>{student.studentName}</td>
                            <td style={{ border: 'solid' }}>{student.presentationTitle}</td>
                            <td style={{ border: 'solid' }}>{student.supervisor}</td>
                            <td style={{ border: 'solid' }}>{student.examiner1}</td>
                            <td style={{ border: 'solid' }}>{student.examiner2}</td>
                        </tr>
                        )}
                    </tbody>  
                </Table>
            <Modal show={this.state.showStudentModal} size='xl'>
              <Modal.Header>{this.state.selectedStudent}</Modal.Header>
              <Modal.Body>
                    <ScheduleInterface group="Student" individual={this.state.selectedStudent} slots={this.state.slotList}></ScheduleInterface>
                    <Modal show={this.state.showDelete} size='xl'>
                        <Modal.Header>Delete Student Confirmation</Modal.Header>
                        <Modal.Body>
                            <h4>Do you confirm to delete {this.state.selectedStudent}? Deleted data cannot be recovered.</h4>
                            <h5>Click Yes to confirm deletion. Click close to deny deletion and close the tab.</h5>
                            <br/>
                            <Button variant="danger" onClick={confirmDelete}>Yes</Button>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={handleDeleteModal}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                  
                    <Modal show={this.state.showEdit}>
                    <Modal.Header>Edit Info</Modal.Header>
                    <Modal.Body>
                        <Container fluid>
                            <Form>
                                <Form.Group>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control  value={this.state.editTitle} name="title" placeholder="Type title here" onChange={(e)=>{this.setState({editTitle:e.target.value})}}></Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Supervisor</Form.Label>
                                    <Form.Control aria-label="Default select example" as="select" onChange={(e)=>this.setState({editSv:e.target.value})}>
                                        <option value={this.state.editSv}>{this.state.editSv}</option>
                                        {this.state.staffList.map(staff =>
                                            <option value={staff.staffName}>{staff.staffName}</option>
                                            )}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Examiner 1</Form.Label>
                                    <Form.Control aria-label="Default select example" as="select" onChange={(e)=>this.setState({editExOne:e.target.value})}>
                                        <option value={this.state.editExOne}>{this.state.editExOne}</option>
                                        {this.state.staffList.map(staff =>
                                            <option value={staff.staffName}>{staff.staffName}</option>
                                            )}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Examiner 2</Form.Label>
                                    <Form.Control aria-label="Default select example" as="select" onChange={(e)=>this.setState({editExTwo:e.target.value})}>
                                        <option value={this.state.editExTwo}>{this.state.editExTwo}</option>
                                        {this.state.staffList.map(staff =>
                                            <option value={staff.staffName}>{staff.staffName}</option>
                                            )}
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </Container>
                        <br/>
                        <Button onClick={submitEditStudent}>Submit</Button>
                    </Modal.Body>
                    <Modal.Footer>
                            <Button onClick={closeEditModal}>Close</Button>
                    </Modal.Footer>
                </Modal>    
              </Modal.Body>
              <Modal.Footer>
                <div>
                    <Button variant="danger" onClick={handleDeleteModal}>Delete Student</Button>
                    <Button variant="success" className="m-3" onClick={openEditModal}>Edit Info</Button>
                    <Button onClick={closeStudentModal}>Close</Button>
                </div>   
              </Modal.Footer>
          </Modal>


      </div>
  );
  }
}

export default StudentListPage;
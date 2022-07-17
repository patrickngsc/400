import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import {BrowserRouter,Routes,Route,Link, useParams} from 'react-router-dom';
import { CSVLink } from 'react-csv';
import './Style.css';
import ReactHtmlParser from "react-html-parser";
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
var day = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
var room = ['room 1','room 2','room 3','room 4'];
var flag = 0;

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

class DataEntryPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {file:''};
    this.myRef = React.createRef();
}
  render(){
    const CreateInputFolder=()=>{
      fetch("http://localhost:9000/dataFolder/createInputFolder")
            .then((response)=>{return response.text();})
            .then((result)=>{
                console.log('Success',result);
                alert('Folder created: '+result);
            })
    }



    const readExcel=(file)=>{
      const promise = new Promise((resolve, reject)=>{
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file)
        fileReader.onload=(e)=>{
          const bufferArray=e.target.result;
          const wb = XLSX.read(bufferArray,{type:'buffer'});
          const xsList=wb.SheetNames;
          const ws1=wb.Sheets[xsList[0]];//select 1st sheet
          const data=XLSX.utils.sheet_to_json(ws1)
          resolve(data);
        };
        fileReader.onerror=((error)=>{
          reject(error);
        })
      });
      promise.then((d)=>{
        console.log(d);
      });
    }


    const send = event =>{
      var inputFile = document.getElementById("file-input");
      const data = new FormData();
      data.append("file",this.state.file);
      var fileName=inputFile.value.split('\\')[inputFile.value.split('\\').length-1];
      console.log(fileName);
      const requestOptions = {
        method: 'POST',
        body: data
      };
      if(inputFile.value.length>0){
        var fileNameSplit = fileName.split('-');
        var fileEx = fileName.split('.')[fileName.split('.').length-1];
        if(fileEx!=='xlsx'){
          alert("The import only accept .xlsx file.")
          return
        }
        if(fileNameSplit.length!==2){
          console.log("2")
          alert("Please import excel file with file name format stated.")
          return
        }
        if(!isNumeric(fileNameSplit[0])||!isNumeric(fileNameSplit[1].split(".")[0])){
          console.log("numeric")
          alert("Please import excel file with file name format stated.")
          return
        }
        if(fileNameSplit[0].length!==4||fileNameSplit[1].split(".")[0].length!==4){
          console.log("length")
          alert("Please import excel file with file name format stated.")
          return
        }
              fetch("http://localhost:9000/importData/uploadExcelInput/upload",requestOptions)
            .then((response)=>{return response.text();})
                    .then((result)=>{
                      if(result !== "exist"){
                      var folder = result.split('/')[result.split('/').length-1];
                        fetch("http://localhost:9000/importData/createInputExcel?folder="+folder+"&file="+fileName)
                        .then((response=>{return response.text();}))
                        .then((res)=>{
                          console.log('Success',res);
                          alert('File uploaded.\nFolder: '+result);
                        })}
                        else{
                          alert("Fail to upload. Folder of this academic year had been uploaded before. Please continue existing data entry folder.");
                        }
                    })
                    .catch((error)=>{console.error('Error',error)});
      }
      else{
        alert('Please select a file');
      }
    }


    
    return ( 
      <div>
      <h2>Data Entry Page</h2>
          <br/>
        <div>
          <Button onClick={()=>{window.location.href="/EditInfoPage"}}>Continue Existing Data Entry Folder</Button>
          <br/>
          <br/>
          <div className="square border border-4">
          <h4>Import Excel File</h4>
          <h6>Naming format: year-year.xlsx (example: 2019-2020.xlsx)</h6>
          <h6>Imported file must contain the following sheets:</h6>
          <ul>
            <li>Lec List</li>
            <li>Stu-Sup-Exam</li>
            <li>Venue</li>
          </ul>
            <input id='file-input' type="file" accept='.xlsx'
            onChange={(e)=>{
              this.setState({file:e.target.files[0]});
              console.log( e.target.files[0]);
              //readExcel(file);
            }}
            />
            <br/>
            <br/>
            <Button onClick={send}>Import Data</Button>
          </div>
        </div>
        <br/>
        <Button variant="secondary" onClick={()=>{window.location.href="/home"}}>Back</Button>
      </div>
  );
  }
}

export default DataEntryPage;
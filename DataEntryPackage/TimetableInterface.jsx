import React, { useState, useEffect} from 'react';
import { csv } from 'd3';
import {BrowserRouter,Routes,Route,Link, useParams} from 'react-router-dom';
import { CSVLink } from 'react-csv';
import './Style.css';
import { DropDownListComponent, MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import { closest, remove, addClass, isNullOrUndefined  } from '@syncfusion/ej2-base';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import {PopupOpenEventArgs,ScheduleComponent,Day,Week,Month, Agenda,WorkWeek,Inject,DragAndDrop,Resize, ResourceDirective,ResourcesDirective, TimelineViews, Print, ExcelExport} from "@syncfusion/ej2-react-schedule";
import {FormValidator, FormValidatorModel} from '@syncfusion/ej2-inputs';
import { Query } from '@syncfusion/ej2-data';
var day = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
var room = ['room 1','room 2','room 3','room 4'];
var flag = 0;

class TimetableInterface extends React.Component{
  constructor(props){
    super(props);
    this.state={
      month:0,
      year:0,
      day:0,
      data:[],
      resourceData: [{
        resourceItem: "Unavailability",
        Id:1
      }],
    }


    this.onFilteringCode = (e) => {
      let query = new Query();
      query = (e.text !== "") ? query.where("Code", 'startswith', e.text, true) : query;
      e.updateData(this.state.courseCode, query);
    }

    this.onFilteringCourse = (e) => {
      let query = new Query();
      query = (e.text !== "") ? query.where("Name", 'startswith', e.text, true) : query;
      e.updateData(this.state.courseName, query);
    }

    this.onFilteringLecturer = (e) => {
      let query = new Query();
      query = (e.text !== "") ? query.where("Lecturer", 'startswith', e.text, true) : query;
      e.updateData(this.state.differentLecturer, query);
    }

    this.onFilteringVenue = (e) => {
      let query = new Query();
      query = (e.text !== "") ? query.where("Venue", 'startswith', e.text, true) : query;
      e.updateData(this.state.venueData, query);
    }

}
getWeather(value) {
  switch (value.getDay()) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return null;
  }
}
dateHeaderTemplate(props) {
  return (
    <div>
      <div className="scheduleHeader">{this.getWeather(props.date)}</div>
    </div>
  );
}



//Form input
editorTemplate(props) {
  return props !== undefined ? (
    <table
      className="custom-event-editor"
      style={{ width: "100%", cellpadding: "5" }}
    >
      <tbody>

      </tbody>
    </table>
  ) : (
    <div></div>
  );
}

//When window form pop up
onPopupOpen(args) {
  if (args.type === 'Editor') {
    args.duration = 60;
}
  }

  onEventRendered = function(args){
    var color;
    if (this.state.loading === false){
    if(args.data.Clash == "Clash"){
      color = 'red';
    } else if (args.data.Clash == "Not Clash"){
      color = 'primary blue';
    }

    args.element.style.backgroundColor = color; }
  }

 //Detail to be show in cell in scheduler
 eventTemplate(props) {
  return (
    <div className="template-wrap">
      <div className="subject">{props.Name}</div>
      <div className="venue">{props.Venue}</div>
    </div>
  );
}



onActionBegin(event) {
  if (event.requestType === "eventCreate" && this.isTreeItemDropped) {
    let treeViewdata = this.treeObj.fields.dataSource;
    const filteredPeople = treeViewdata.filter(
      (item) => item.Id !== parseInt(this.draggedItemId, 10)
    );
    this.treeObj.fields.dataSource = filteredPeople;
    let elements = document.querySelectorAll(
      ".e-drag-item.treeview-external-drag"
    );
    for (let i = 0; i < elements.length; i++) {
      remove(elements[i]);
    }
  }

  //Include Excel Export function
  if (event.requestType === 'toolbarItemRendering') {
    let exportItem = {
        align: 'Right', showTextOn: 'Both', prefixIcon: 'e-icon-schedule-excel-export',
        text: 'Excel Export', cssClass: 'e-excel-export', click: this.onExportClick.bind(this)
    };
    event.items.push(exportItem);
  }
}

onItemDrag(event) {
  if (this.scheduleObj.isAdaptive) {
    let classElement = this.scheduleObj.element.querySelector(
      ".e-device-hover"
    );
    if (classElement) {
      classElement.classList.remove("e-device-hover");
    }
    if (event.target.classList.contains("e-work-cells")) {
      addClass([event.target], "e-device-hover");
    }
  }
  if (document.body.style.cursor === "not-allowed") {
    document.body.style.cursor = "";
  }
  if (event.name === "nodeDragging") {
    let dragElementIcon = document.querySelectorAll(
      ".e-drag-item.treeview-external-drag .e-icon-expandable"
    );
    for (let i = 0; i < dragElementIcon.length; i++) {
      dragElementIcon[i].style.display = "none";
    }
  }
}

onDragStart(args){
  args.excludeSelectors = 'e-header-cells,e-header-day,e-header-date,e-all-day-cells';
  args.navigation.enable = false;
}

onCellClick = function(){

}

onDragStop = function(args){
  var json = this.state.data;

  for(var i=0; i<json.length; i++){
    if(json[i].Id == args.data.Id){
      var json1 = []
      json1.push(args.data)
      json[i].Clash = this.checkClash(json1, json,true,true);
    }
  }
  this.setState({data: json})
}
onResizeStop = function(args){
  var json = this.state.data;
  var json1 = []
  json1.push(args.data)
  for(var i=0; i<json.length; i++){
    if(json[i].Id == args.data.Id){
      json[i].Clash = this.checkClash(json1, json,true,true);
    }
  }
  this.setState({data: json})
}

onActionComplete = function(args){   
  var json = this.state.data;
  var json1 = this.state.data;

  for(var i=0; i<json.length; i++){
    var jsonData = []
    jsonData.push(json[i])
    json[i].Clash = this.checkClash(jsonData, json1,false,false);
  }

  this.setState({data: json})
}

  render(){
    const splitUrl = window.location.href.split("/");
    const folderID = splitUrl[splitUrl.length-1];
    return ( 
      <div>
        
        <ScheduleComponent
                          ref={schedule => this.scheduleObj = schedule}
                       //   cssClass="schedule-drag-drop"
                       //   width={this.state.schedulerWidth}
                       startHour='09:00'
                      endHour='17:30'
                          height="95vh"
                    //      selectedDate={
                    //        new Date(this.state.year, this.state.month, this.state.day)
                   //       }
                          eventSettings={{
                            //Scheduler Data
                            dataSource: this.state.data,
                            template: this.eventTemplate.bind(this),
                          }}
                          currentView="WorkWeek"
                          editorTemplate={this.editorTemplate.bind(this)}
                          popupOpen={this.onPopupOpen.bind(this)}
                          timeScale= {{
                              enable: true,
                              interval: 30,
                              slotCount:1
                          }}
                          rowAutoHeight={true}
                          dateHeaderTemplate={this.dateHeaderTemplate.bind(this)}
                   //       actionBegin={this.onActionBegin.bind(this)}
                   //       drag={this.onItemDrag.bind(this)}
                   //       dragStart={(this.onDragStart.bind(this))}
                   //       dragArea= ".content-wrapper"  
                          group={{ resources: ['resourceItem'] }}
                          showQuickInfo={false} 
                          cellClick={this.onCellClick.bind(this)}
                          showTimeIndicator={false}
                          views={['WorkWeek']}
                          eventRendered={this.onEventRendered.bind(this)}
                    //      dragStop={this.onDragStop.bind(this)}
                          resizeStop={this.onResizeStop.bind(this)}
                         // actionComplete={this.onActionComplete.bind(this)}
                        >
                        
                        <ResourcesDirective>
                          <ResourceDirective field='ResourceId' title='resourceItem' name='resourceItem' dataSource={this.state.resourceData} textField='resourceItem' idField='Id'>
                          </ResourceDirective>

                        </ResourcesDirective>
                        <Inject services={[WorkWeek,DragAndDrop,Resize,Print,ExcelExport]} />
                      </ScheduleComponent>



      </div>
      
  );
  }
}

export default TimetableInterface;
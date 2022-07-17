import {useState} from "react";
export default function CSVReader({readCSVData}){
    const [csvFile, setCsvFile]=useState();
    const processCSV = (str,delim=',')=>{
        const presentationsOnSlot = str.split(delim);
        readCSVData(presentationsOnSlot);
    }
    const submit=()=>{
        const file=csvFile;
        const reader=new FileReader();
        reader.onload=function(e){
            const text=e.target.result;
            processCSV(text);
        }
        reader.readAsText(file);
    }
    return(
        <form id='csvForm'>
            <input
                type='file'
                accept='.csv'
                id='csvFile'
                onChange={(e)=>{
                    setCsvFile(e.target.files[0])
                }}
            />
            <br/>
            <button
                onClick={(e)=>{
                    e.preventDefault()
                    if(csvFile) submit();
                }}
            >
                Submit
            </button>
        </form>
    );
}

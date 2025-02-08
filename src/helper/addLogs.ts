export default function addLogs(oldLog:string,newLog:string):string{
let splitLog = oldLog.split(" , ");
splitLog.push(newLog);
return splitLog.join(" ,")
}
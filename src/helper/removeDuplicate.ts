export default function removeDuplicate(coreData:any){
    const seen = new Set();
    return coreData.filter((data:any) =>{
        let subscriptionId = data.subscriptionId;
        if(seen.has(subscriptionId)){
            return false
        }else{
            seen.add(subscriptionId);
            return true
        }
    })
}
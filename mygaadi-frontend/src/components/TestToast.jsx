import { toast } from "react-toastify";

const TestToast = ()=>{
    return(
        <button
         onClick={()=>toast.success("toastify is working")} style={{padding:"10px"}}>
            Test Toast
        </button>
    )
}
export default TestToast;
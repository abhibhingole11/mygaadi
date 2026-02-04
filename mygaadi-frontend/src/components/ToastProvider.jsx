import { ToastContainer } from "react-toastify"

const ToastProvider = ()=>{
    return(
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
        
        />
    )
}
export default ToastProvider;
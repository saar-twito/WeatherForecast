import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showErrorNotification = (message: string, time: number = 2000) => {
  toast.error(message, {
    position: toast.POSITION.BOTTOM_CENTER, autoClose: time,
    hideProgressBar: true
  });
}


export const showInfoNotification = (message: string, time: number = 2000) => {
  toast.info(message, {
    position: toast.POSITION.BOTTOM_CENTER, autoClose: time,
    hideProgressBar: true
  });
}
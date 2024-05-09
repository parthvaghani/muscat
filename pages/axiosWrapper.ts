import { API_URL } from '@pages/constant';
import axios from 'axios'; 
async function getClientIPAddress(): Promise<string> {
  try {
      const response = await axios.get('https://api.ipify.org?format=json');
      const ipAddress = response.data.ip;
      return ipAddress;
  } catch (error) {
      console.error('Error getting client IP address:', error);
      throw error;
  }
}

 
async function axiosPost(url: string, values1: any): Promise<any> {
  try {
    const response = await axios.post(url, values1); 
    if(!url.includes('system_log'))
      //await registerLog(url, values1, response);
    return response;
  } catch (error) {
    // Handle errors here
    console.error('Error registering user:', error);
    throw error;
  }
}

async function registerLog(url: string, values1: any, response : any) {
  try { 
    const str = sessionStorage.getItem('user')
    const id_address = await getClientIPAddress();
    if(str){
      const type = JSON.parse(str).type  
      
      await axios.post(`${API_URL}/system_log/Register`, {
        'category': '접속기록',
        'api_name': url,
        'ip_address': id_address,
        'user_name':  JSON.parse(str).name,
        'user_email':  JSON.parse(str).user_id,
        'user_type':  type,
        'log_type':  url,
        'log_request': JSON.stringify(values1),
        'log_response': JSON.stringify(response)
      }); 
    }else{
      await axios.post(`${API_URL}/system_log/Register`, {
        'category': '접속기록',
        'api_name': url,
        'ip_address': id_address,
        'user_name':  '',
        'user_email':  '',
        'user_type':  '',
        'log_type':  url,
        'log_request': JSON.stringify(values1),
        'log_response': JSON.stringify(response)
      }); 
    }
   
  } catch (error) {
    // Handle errors here
    console.error('Error registering user:', error);
    throw error;
  }
}

export async function axiosDelete(url: string, values1: any): Promise<any> {
  try { 
     const response = await axios.delete(url, values1);
     await registerLog(url, values1, response);
    return response;
  } catch (error) {
    // Handle errors here
    console.error('Error registering user:', error);
    throw error;
  }
}

export async function axiosPost2(url: string, values1: any, values2: any): Promise<any> {
  try {
    const response = await axios.post(url, values1,values2);
    await registerLog(url, values1, response);
    return response;
  } catch (error) {
    // Handle errors here
    console.error('Error registering user:', error);
    throw error;
  }
}

export default axiosPost; 

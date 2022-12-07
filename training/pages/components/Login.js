import React, {useState} from 'react';
import login from '../../styles/Login.module.css';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment';

export default function Login(users) {

    const [data, setData] = useState(users.data);
    const [username, setUsername] = useState('');
    const [password, setPassowrd] = useState('');
    const user = [];
    const router = useRouter();

    async function Login() {

        for (var i in data) {
            if (String(data[i].erp_code) === username && moment(data[i].birth_day.slice(0,10)).format('YYYYMMDD') === password) {
                user.push({
                    erp_code: data[i].erp_code,
                    lastname: data[i].lastName,
                    firstname: data[i].firstName,
                    password: moment(data[i].birth_day.slice(0,10)).format('YYYYMMDD'),
                    user_id: data[i].user_id
                })
            }
        }

        if (username === '' || password === '') {
            toast("Аль нэг талбар хоосон байна!!!")
        } else {
            if (user.length == 0) {
                toast("Нэвтрэх нэр эсвэл нууц үг буруу байна!!!")
            }
            else {
                if (String(user[0].erp_code) === username && user[0].password === password) {
                    if (user[0].user_id === 1) {
                        toast("Амжилттай нэвтэрлээ. Түр хүлээнэ үү!")
                        sessionStorage.setItem("user", user[0].firstname)
                        sessionStorage.setItem("lastname", user[0].lastname)
                        sessionStorage.setItem("userId", user[0].erp_code)
                        
                            router.push({
                                pathname: '/components/Admin/Admin'
                            })
                    } 
                    if (user[0].user_id === 3) {
                        toast("Амжилттай нэвтэрлээ. Түр хүлээнэ үү!")
                        sessionStorage.setItem("user", user[0].firstname)
                        sessionStorage.setItem("lastname", user[0].lastname)
                        sessionStorage.setItem("userId", user[0].erp_code)
                        
                            router.push({
                                pathname: '/components/User/Home'
                            })
                    } 
                }
                else {
                    toast("Нэвтрэх нэр эсвэл нууц үг буруу байна!!!")
                }
        }
    }
    }

  return (
    <div className='w-full md:w-1/2 xl:w-1/3 login'>
         <ToastContainer
                position='top-center'
                autoClose='500'
            />
        <form action="" >
            <h1 className='text-gray-100 font-semibold mx-auto text-center mb-8 text-xl'>Нэвтрэх хэсэг</h1>
            <input type="text" name="" id="username" placeholder='Username' onChange={(e) => setUsername(e.target.value)}/>
            <input type="password" name="" id="password" placeholder='Password' onChange={(e) => setPassowrd(e.target.value)}/>
            <div className='w-full text-center flex justify-center'>
                <div className='button' onClick={Login}>Нэвтрэх</div>
            </div>
        </form>
    </div>
  )
}

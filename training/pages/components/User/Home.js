import React, { useState } from 'react'
import Head from 'next/head'
import Layout from '../Layout/Layout'
import home from '../../../styles/Home.module.css'
import Image from 'next/image'

export default function Home(props) {
    const [data, setData] = useState(props.db.products);
    
    return (
        <Layout>
            <Head>
                <title>Нүүр Хуудас</title>
                <link rel="icon" href="/mcsstar.png" />
            </Head>

                <div className='w-full'>
                    <h2 className='text-center my-3'>Home Page</h2>
                    <div className={`${home.title} flex flex-col w-full`}>
                        <Image alt='' src={'/images/content.jfif'} width={1800} height={400} className='border w-full' objectFit='cover' />  
                        <p className={`${home.onimage} text-lg w-[40%]`}>Дэлхийн жишигт хүрсэн, өрсөлдөхүйц мэдлэг, чадвар, боловсролтой нийгмийг бүтээлцэхийн төлөө. <hr></hr>Хамтдаа хөгжье</p>  
                    </div>
                </div>

        </Layout>
    )
}

export const getServerSideProps = async (context) => {

    const res = await fetch('https://dummyjson.com/products')
    const db = await res.json()

    return {
        props: {
            db
        }
    }
}
import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../AdminLayout/Layout';
import SideNav from '../SideNav';
import Head from 'next/head';
import { useRouter } from 'next/router';
import course from '../../../../styles/Course.module.css';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import { MultiSelect } from 'react-multi-select-component';
import { PrismaClient } from '@prisma/client';
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function AddUser(props) {

    const [data, setData] = useState(props.db)
  
    const events = []
  
    for (let i = 0; i < data.length; i++) {
      events.push({
         title: data[i].name,
         start: data[i].startDate
      })
    }
   
    return (
        <Layout>
            <Head>
                <title>Сургалтын хуваарь</title>
                <link rel="icon" href="/images/getsitelogo.png" />
            </Head>
            <div className='flex flex-col sm:flex-row justify-start h-screen'>
                <SideNav />
                <div className='w-full px-5 md:px-28 flex flex-col items-center'>
                    <div className='body p-3 w-full'>
                        <FullCalendar 
                        plugins = {[dayGridPlugin]}
                        events={events}
                        allDayContent
                        />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

const prisma = new PrismaClient();

export const getServerSideProps = async (context) => {

    const res = await prisma.course.findMany();
    const db = JSON.parse(JSON.stringify(res))

    return {
        props: {
            db: db
        }
    }
}
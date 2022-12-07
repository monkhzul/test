import React from 'react'
import Image from 'next/image'
import styles from '../../../styles/Home.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <a
                href="https://mcs.mn/mn/"
                target="_blank"
                rel="noopener noreferrer"
                className='font-semibold'
            >
                <span className={`${styles.logo} flex items-center`}>
                    <Image
                        src={'/images/mcs.jpg'}
                        width={120}
                        height={50}
                    />
                </span>
            </a>
        </footer>
    )
}

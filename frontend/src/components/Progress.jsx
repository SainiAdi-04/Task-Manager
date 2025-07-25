import React from 'react'


const Progress = ({progress, status}) => {
    const getcolor=()=>{
        switch(status){
            case 'In Porgress':
                return 'text-cyan-500 bg-cyan-500 border border-cyam-500/10'

            case 'Completed':
                return 'text-indigo-500 bg-indigo-500 border border-indigo-500/10'

            default:
                return 'text-violet-500 bg-violet-500 border border-violet-500/10'
        }
    }


  return (
    <div className='w-full bg-gray-200 rounded-full h-1.5'>
        <div className={`${getcolor} h-1.5 rounded-full text-center text-xs font-medium`} style={{width:`${progress}%`}}></div>
    </div>
  )
}

export default Progress
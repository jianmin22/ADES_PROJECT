import React from 'react'


const Notification = ({ NotifTitle, NotifMsg, visible }) => {

    return (
        <div style={{ display: visible ? 'flex' : 'none' }}>
            <div class="absolute top-0 right-0 h-13 w-15 fixed inset-0 flex items-center justify-center top-0 bottom-10 left-0 z-50">
                <div class="bg-white rounded-lg shadow-lg p-6 flex">
                    <div>
                        <h2 class="text-lg font-semibold">{NotifTitle}</h2>
                        <p class="text-gray-600 mt-2">{NotifMsg}</p>
                    </div>

                    <button class="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-5">X</button>
                </div>
            </div>
        </div>
    )
}

export default Notification
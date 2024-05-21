import React from 'react'

function AboutUs() {
    return (<div className='m-5'>

        <div className=" flex items-center justify-center">

            <div className="bg-lightOrange rounded-lg shadow p-8 m-5 w-full">

                <h1 className="text-2xl font-semibold mb-4 m-5">About Us</h1>
                <div className='flex justify-center m-5'>
                    <p className="text-gray-600 mb-6 flex-1 text-xl m-5">
                        Welcome to our Huang's Bakery! We are dedicated to providing high-quality products and services to our customers. With years of experience in the industry, we strive to exceed expectations and deliver excellence in everything we do.
                    </p>
                    <img src="https://bestinsingapore.com/wp-content/uploads/2020/12/portrait-smiling-young-male-baker-looking-fresh-baked-croissant-baking-tray_23-2148189046.jpg" className='m-5'/>
                </div>
                <div className="border-t border-gray-300 pt-4 m-5">
                    <h2 className="text-lg font-semibold mb-2">Our Mission</h2>
                    <p className="text-gray-600">
                        Our mission is to create innovative solutions that make a positive impact on people's lives. We are committed to continuous improvement and fostering strong relationships with our customers and partners.
                    </p>
                </div>
                <div className="border-t border-gray-300 pt-4 m-5">
                    <h2 className="text-lg font-semibold mb-2">Our Team</h2>
                    <p className="text-gray-600">
                        Our team consists of passionate individuals who are experts in their respective fields. We work collaboratively to tackle challenges and bring creative ideas to life.
                    </p>
                </div>
                <div className="border-t border-gray-300 pt-4 m-5">
                    <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
                    <p className="text-gray-600">
                        If you have any questions or inquiries, feel free to reach out to us at
                        <a href="mailto:info@example.com" className="text-blue-500">info@example.com</a>.
                    </p>
                </div>
            </div>
        </div>
    </div>)
}

export default AboutUs

import React from 'react';
import SignUpForm from '../components/Signup/SignUpForm';

const SignUp = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className=" text-mainOrange rounded-xl mt-3 m-1">
        <h1 className="text-5xl">Sign Up</h1>
      </div>
      <hr className='m-2' />
      <hr/>
      <div className='text-red-900 text-md text-center m-2' >Password: Minimum 8 characters, at least 1 letter, 1 number and 1 special character</div>
      <SignUpForm />
    </div>
  );
};

export default SignUp;

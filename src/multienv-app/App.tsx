import { useState } from 'react';
import ky from 'ky';
import logo from './digital-platform-logo-transparent.png';

export function App() {

  // TODO: FIX-ME below after you find your API endpoint"
  const API = '/multienv-example/api/';

  const [message1, setMessage1] = useState('Message from API endpoint one will appear here');
  const [message2, setMessage2] = useState('Message from API endpoint two will appear here');

  const getMessage1 = async () => {
    setMessage1('Fetching message from API endpoint one...');
    const data = await (ky.get(`${API}hello1`).json() as any);
    setMessage1(data.message);
  };

  const getMessage2 = async () => {
    setMessage2('Fetching message from API endpoint two...');
    const data = await (ky.get(`${API}hello2`).json() as any);
    setMessage2(data.message);
  };

  return (
    <>
      <div className="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10 ">
        <div className="lg:text-center space-y-10">
          <div className="flex flex-wrap justify-center">
            <img src={logo} alt={"logo"} />
          </div>
          <div className='space-y-6'>
            <h1 className="text-3xl font-extrabold">Multi Environment Example!</h1>
            <p className="text-2xl">{process.env.STAGE_NAME} Environment</p>
          </div>
          <div className="space-y-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={getMessage1}
            >
              Fetch message from API endpoint one
            </button>
            <p>{message1}</p>
          </div>
          <div className="space-y-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={getMessage2}
            >
              Fetch message from API endpoint two
            </button>
            <p>{message2}</p>
          </div>
        </div>
      </div>
    </>
  );
}

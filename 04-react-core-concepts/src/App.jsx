import {
  useState,
} from 'react';

import Clock from './components/Clock';
import Message from './components/Message';

function App() {
  console.log("app rendered");
  const [message, setMessage] = useState("greetings");
  const handleGreeing = (m) => {
    setMessage(m); // trigger diffing and re-rendering
  }
  return (
    <>
      <div className="container">
        <div className='card'>
          <div className='card-body'>
            <div className="display-1">react core conceps</div>
            <hr />
            <div className='d-flex justify-content-around'>
              <button onClick={e => handleGreeing("Good Morning")} className='btn btn-primary'>GM</button>
              <button onClick={e => handleGreeing("Good Noon")} className='btn btn-primary'>GN</button>
              <button onClick={e => handleGreeing("Good Evening")} className='btn btn-primary'>GE</button>
            </div>
            <hr />
            <Message message={message} />
            <hr />
            <div className='row'>
              <div className='col-4'>
                <Clock />
              </div>
              <div className='col-4'>
                <Clock timeZone="Asia/Dubai" />
              </div>
              <div className='col-4'>
                <Clock timeZone="America/New_York" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App

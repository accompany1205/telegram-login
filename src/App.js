import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { TLoginButton, TLoginButtonSize } from 'react-telegram-auth';


const BOT_TOKEN = '6517591713:AAG6eQwp00UOKUurahUMeh4ahxvIwKmYRYI';
const USERNAME_TO_CHECK = 'accompany1205';

const App = () => {
  return (
    <>
      
      <TLoginButton
        botName="samplebot"
        buttonSize={TLoginButtonSize.Large}
        lang="en"
        usePic={false}
        cornerRadius={20}
        onAuthCallback={(user) => {
          console.log('Hello, user!', user);
        }}
        requestAccess={'write'}
      />
    </>
  );
};

export default App;


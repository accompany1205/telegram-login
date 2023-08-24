import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { TLoginButton, TLoginButtonSize } from 'react-telegram-auth';


const BOT_TOKEN = '6517591713:AAG6eQwp00UOKUurahUMeh4ahxvIwKmYRYI';
const USERNAME_TO_CHECK = 'accompany1205';

const App = () => {

  useEffect(() => {
    checkUsernameValidity();
  }, [])

  async function checkUsernameValidity() {
    try {
      const response = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getChat`, {
        params: {
          chat_id: `@${USERNAME_TO_CHECK}`
      }
      });

      console.log(response.status);

      if (response.status === 200) {
        console.log(`Username @${USERNAME_TO_CHECK} is valid`);
      } else {
        console.log(`Username @${USERNAME_TO_CHECK} is not valid`);
      }
    } catch (error) {
      console.error('Error checking username:', error.message);
    }
  }

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


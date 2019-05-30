import React, { useState, useRef, useEffect } from 'react';
import AWS, { AWSError } from 'aws-sdk';

AWS.config.region = process.env.REACT_APP_REGION; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: `${process.env.REACT_APP_REGION}:${process.env.REACT_APP_IDENTITY_POOL_ID}`,
});

// Function invoked by button click
const SpeakText: React.FC<{
  text: string;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ text, reload, setReload }) => {
  const [audioSource, setAudioSource] = useState('');
  const audio: React.MutableRefObject<HTMLAudioElement | null> = useRef(null);

  useEffect(() => {
    if (audio.current && audio.current.load) {
      audio.current.load();
    }
  }, [audioSource]);

  // Create the JSON parameters for getSynthesizeSpeechUrl
  const speechParams = {
    OutputFormat: 'mp3',
    SampleRate: '16000',
    Text: text,
    TextType: 'text',
    VoiceId: 'Matthew',
  };
  // Create the Polly service object and presigner object
  const polly = new AWS.Polly({ apiVersion: 'latest' });
  const signer = new AWS.Polly.Presigner({ params: speechParams, service: polly });

  // Create presigned URL of synthesized speech file
  signer.getSynthesizeSpeechUrl(speechParams, function(error: AWSError, url: string) {
    if (error) {
      console.log({ error, url, speechParams });
    } else {
      if (reload && url !== audioSource) {
        setAudioSource(url);
        setReload(false);
      }
    }
  });

  return (
    <audio ref={audio} id='audioPlayback' controls>
      <source id='audioSource' type='audio/mp3' src={audioSource} />
    </audio>
  );
};

export const PollyApp: React.FC = () => {
  const [text, setText] = useState('Very good to meet you');
  const [reload, setReload] = useState(false);

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
    setText(value);
  };

  const handleButtonOnClick: React.FormEventHandler = evt => {
    evt.preventDefault();
    setReload(true);
  };

  return (
    <>
      <form id='textToSynth'>
        <input type='text' id='textEntry' value={text} onChange={onInputChange} />
        <button className='btn default' type='submit' onClick={handleButtonOnClick}>
          Synthesize
        </button>
      </form>
      <SpeakText text={text} setReload={setReload} reload={reload} />
    </>
  );
};

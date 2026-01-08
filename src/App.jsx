import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import * as fp from 'fingerpose';
import { VictoryGesture, ThumbsUpGesture } from './GestureDefinition';
import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const lastLogTime = useRef(0);

  const [modelLoaded, setModelLoaded] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [gestureText, setGestureText] = useState("Scanning...");
  const [gestureColor, setGestureColor] = useState("text-gray-500");

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    setModelLoaded(true);
    // Loop detection
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Make Detections
      const hand = await net.estimateHands(video);

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          VictoryGesture,
          ThumbsUpGesture
        ]);

        // estimate gestures
        const gesture = await GE.estimate(hand[0].landmarks, 8.5);

        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          // Find gesture with highest confidence
          const confidence = gesture.gestures.map(
            (prediction) => prediction.score
          );
          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence)
          );

          const maxGesture = gesture.gestures[maxConfidence];

          if (maxGesture.score >= 8.5) {
            const name = maxGesture.name;
            handleGesture(name);
          }
        }
      }
    }
  };

  const handleGesture = (name) => {
    let statusText = "Scanning...";
    let statusColor = "text-gray-500";

    if (name === "victory") {
      statusText = "Victory";
      statusColor = "text-blue-500";
    }
    if (name === "thumbs_up") {
      statusText = "All ok!";
      statusColor = "text-green-500";
    }

    setGestureText(statusText);
    setGestureColor(statusColor);
    logToFirebase(name);
  };

  const logToFirebase = async (name) => {
    const now = Date.now();
    // 3-second cooldown (Rate Limiting)
    if (now - lastLogTime.current > 3000) {
      lastLogTime.current = now;
      setStatusMessage(`Logging ${name}...`);

      console.log("Attempting to save..."); // Requested log
      console.log(`Logging ${name} to Firebase...`);

      try {
        await addDoc(collection(db, "history"), {
          gestureName: name,
          timestamp: new Date()
        });
        console.log("Logged successfully.");
        setStatusMessage("Logged to Firebase successfully!");
        setTimeout(() => setStatusMessage(""), 2000);
      } catch (e) {
        // Requested error logging
        console.error("Error writing to Firebase:", e);
        setStatusMessage(`Error: ${e.message}`);
      }
    }
  };

  useEffect(() => {
    runHandpose();
  }, []);

  return (
    <div className="App min-h-screen bg-neutral-900 flex flex-col items-center justify-center text-white">
      <header className="absolute top-0 w-full p-4 flex justify-between items-center z-10 glass-effect">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Gesturize</h1>
        <div className="flex flex-col items-end gap-1">
          <span className="text-sm text-gray-400">Status: {modelLoaded ? "Ready" : "Loading Model..."}</span>
          {statusMessage && <span className="text-xs text-yellow-400 animate-pulse text-right">{statusMessage}</span>}
        </div>
      </header>

      <div className="relative border-4 border-gray-700 rounded-xl overflow-hidden shadow-2xl glow-box">
        <Webcam
          ref={webcamRef}
          muted={true}
          className="w-[640px] h-[480px] object-cover"
        />

        {!modelLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
            <p className="animate-pulse text-xl">Loading AI Model...</p>
          </div>
        )}


      </div>

      <div className="flex flex-col items-center mt-6">
        <h3 className={`text-5xl font-extrabold tracking-wide ${gestureColor} transition-colors duration-300 drop-shadow-md`}>
          {gestureText}
        </h3>
        <div className="mt-4 text-center text-gray-400 text-sm">
          <p>Above sign shows persons gesture</p>
        </div>
      </div>

    </div>
  );
}

export default App;

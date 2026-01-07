import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

// --- Victory Gesture (Peace Sign) ---
export const VictoryGesture = new GestureDescription('victory');

// Thumb: Half/Full Curl
VictoryGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.5);
VictoryGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.8);

// Index: No Curl, pointing up
VictoryGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
VictoryGesture.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);

// Middle: No Curl, pointing up
VictoryGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
VictoryGesture.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);

// Ring: Full Curl
VictoryGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
VictoryGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.9);

// Pinky: Full Curl
VictoryGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
VictoryGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9);


// --- Thumbs Up Gesture ---
export const ThumbsUpGesture = new GestureDescription('thumbs_up');

// Thumb: No Curl, pointing up/diagonal
ThumbsUpGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
ThumbsUpGesture.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
ThumbsUpGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.9);
ThumbsUpGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.9);

// All other fingers: Full Curl
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    ThumbsUpGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
    ThumbsUpGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

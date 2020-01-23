# four sensor canvas
##### my Ada Developers Academy capstone project

react app and arduino sketch for controlling a p5 canvas with RFID tokens on a 2x2 diamond shaped grid of RFID readers to activate the visuals on the computer screen with the base of each drawing being made by a machine learning model

![four sensor canvas diagram - arduino and peripherials connected to laptop, serial output connected to react app via websocket](https://github.com/geli-gel/four-sensor-canvas/blob/master/high_level_diagram.png?raw=true "four sensor canvas diagram")


## how to start

### gather parts & tools
- Arduino Uno R3 & USB cable (x1)
- Mifare RC522 RFID reader modules & header pins (x4)
- Mifare Classic 1K 13.56Mhz RFID sticker tags (x26)
- breadboard (x1)
- male-male jumper cables (x6)
- male-female jumper cables (x28)
- soldering station with eye protection and lead-free solder (lead-free is optional)
- material to build polygons to place sticker tags on/in (I used cardboard and hot glue and placed the sticker tags on the inside before sealing)

### prepare arduino
upload the sketch and wire up the electronics
1. install [MFRC522 Library v. 1.4.5](https://github.com/miguelbalboa/rfid) from Arduino IDE library manager
1. Wire arduino to RFID readers according to [this diagram](https://raw.githubusercontent.com/Annaane/MultiRfid/master/Wiring.jpg "Annaane's Wiring Image") but with a 4th reader's SPI SS pin plugged into the Arduino's '6' pin as noted below the comment on line 35 in `sketch.ino`
1. solder headers onto the RFID readers *well*.

![arduino wired to rfid readers](https://i.imgur.com/mkg3WZsm.jpg?1 "arduino wired to rfid readers")

### prepare RFID readers and tokens/tags
1. label / arrange the readers in a diamond shape and prepare their polygon controllers by putting RFID sticker tags onto each side of the polygons:
    - TOP / Reader 1 / 6 sided cube
    - LEFT / Reader 2 / 4 sided pyramid
    - RIGHT / Reader 3 / 4 sided pyramid
    - BOTTOM / Reader 4 / 12 sided thing

1. temporarily uncomment some lines in `sketch.ino` and upload it to the Arduino in order to set new UIDs to match up with readers:
    - uncomment line 95 in `sketch.ino` to confirm the readers are all connected and displaying their firmware versions (`mfrc522[reader].PCD_DumpVersionToSerial();`) If they aren't working, confirm your connections, wiring, and soldering are all good, and see these [troubleshooting tips](https://github.com/miguelbalboa/rfid#troubleshooting). 
    - uncomment lines 193-194 to display the UIDs of your tokens (starting with `Serial.print(buffer[i] < 0x10 ? " 0" : " ");`)
    - replace the UIDs in `tagarray` beginning at line 45 to correspond to the UIDs displayed for your tokens. **make sure to omit spaces and zeroes - ie convert "7C 0A 66 31" to "7CA6631"**
    - recomment those lines
1. upload the sketch with the new UIDs onto the Arduino. The serial output from the Arduino IDE should now be a string message containing the reader position label and token number as tags are read.

![arduino and readers in housing with cardboard polygons on top of readers](https://i.imgur.com/4xjaxyWm.jpg?1 "shoddy housing and cardboard polygons")

### connect arduino serial output to app 
1. the arduino's serial output cannot be directly accessed by an app so it needs to be served, this can be easily done by installing the [p5.serialcontrol gui app](https://github.com/p5-serial/p5.serialcontrol/releases/tag/0.1.2).
1. start serialcontrol with the usb port that the arduino is connected to (mine was `"/dev/tty.usbmodem14201"`)
1. hardcode the name of that port into `portName` in line 150 of `src/sketch.js`.

### run it
1. run `npm install` then `npm start` from root, open developer tools to see console output that should confirm that the arduino is connected and sketch-rnn models are loading from ml5.

[demo video with arduino input](https://drive.google.com/open?id=1UDAp7LoeMxUOecAEYqrvK5QRWSDaE6jL) 
[deployed version with dropdowns instead of arduino input](https://four-sensor-palette.herokuapp.com/)



# Notes

- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

- The Arduino sketch was built around @Annaane's [Multiple RFID Readers Project](https://github.com/Annaane/MultiRfid)

- Daniel Shiffman's Coding Train videos were extremely helpful in creating this project, especially [this one about using ml5's sketch-rnn](https://www.youtube.com/watch?v=pdaNttb7Mr8) and [this one about creating a flocking simulation in p5](https://www.youtube.com/watch?v=mhjuuHl6qHM).

- p5.js, ml5.js, and p5.serialport.js are loaded via CDN links in `index.html` rather than managed by npm due to the way the libraries are structured and meant to be used.

- [notes gist](https://gist.github.com/geli-gel/bea2e1dedba971a00dd7c095297b6b80) created while researching and creating project

- [trello](https://trello.com/b/NLbrXQg4) with what's next

- Sometimes I call it four sensor canvas, sometimes I call it four sensor palette 🤷🏽




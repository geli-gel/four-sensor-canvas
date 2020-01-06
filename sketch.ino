// the arduino code as of 10:28


/**
   --------------------------------------------------------------------------------------------------------------------
   Example sketch/program showing how to read data from more than one PICC to serial.
   --------------------------------------------------------------------------------------------------------------------
   This is a MFRC522 library example; for further details and other examples see: https://github.com/miguelbalboa/rfid

   Example sketch/program showing how to read data from more than one PICC (that is: a RFID Tag or Card) using a
   MFRC522 based RFID Reader on the Arduino SPI interface.

   Warning: This may not work! Multiple devices at one SPI are difficult and cause many trouble!! Engineering skill
            and knowledge are required!

   @license Released into the public domain.

   Typical pin layout used:
   -----------------------------------------------------------------------------------------
               MFRC522      Arduino       Arduino   Arduino    Arduino          Arduino
               Reader/PCD   Uno/101       Mega      Nano v3    Leonardo/Micro   Pro Micro
   Signal      Pin          Pin           Pin       Pin        Pin              Pin
   -----------------------------------------------------------------------------------------
   RST/Reset   RST          9             5         D9         RESET/ICSP-5     RST
   SPI SS 1    SDA(SS)      ** custom, take a unused pin, only HIGH/LOW required *
   SPI SS 2    SDA(SS)      ** custom, take a unused pin, only HIGH/LOW required *
   SPI MOSI    MOSI         11 / ICSP-4   51        D11        ICSP-4           16
   SPI MISO    MISO         12 / ICSP-1   50        D12        ICSP-1           14
   SPI SCK     SCK          13 / ICSP-3   52        D13        ICSP-3           15

*/

#include <SPI.h>
#include <MFRC522.h>

// PIN Numbers : RESET + SDAs
#define RST_PIN         9
#define SS_1_PIN        10
#define SS_2_PIN        8
#define SS_3_PIN        7
#define SS_4_PIN        6


// List of Tags UIDs // AZ: that are allowed for each reader
// TO-DO: ? change these into byte sized hex versions? possible? would have to rewrite cards??? idk!
String tagarray[][10] = {
  // TO-DO: make the uidString variable have spaces in it, ie: read it in the same way dumpinfo works
//  {"05 90 DB 22", "15 4A 4A 22", "15 B9 D2 22", "15 C3 FF 22", "15 C9 46 22", "44 2B 9D 23"},
//  {"44 49 87 23", "44 72 18 23", "44 7C 7E 23"}, 
//  {"44 83 4F 23", "44 9A B6 23", "44 B0 0B 23", "44 B9 66 23"},
//  {"44 CF A9 23", "44 D5 DD 23", "54 04 DD 23", "54 1D B4 23", "54 26 D9 23", "76 EB 41 23", "86 88 A5 23", "B2 12 F1 2D", "B2 D6 76 2D", "F5 D1 07 21" },

// no spaces in between to match uidString
  {"0590DB22", "154A4A22", "15B9D222", "15C3FF22", "15C94622", "442B9D23"},
  {"44498723", "44721823", "447C7E23"}, 
  {"44834F23", "449AB623", "44B00B23", "44B96623"},
  {"44CFA923", "44D5DD23", "5404DD23", "541DB423", "5426D923", "76EB4123", "8688A523", "B212F12D", "B2D6762D", "F5D10721" },
};

// Inlocking status :
int tagcount = 0;
bool access = false;

// AZ: Serial Message Parts : 

String readerPositionLabel = "";
int tokenNumberLabel = 0;


#define NR_OF_READERS   4
//#define NR_OF_READERS   2

byte ssPins[] = {SS_1_PIN, SS_2_PIN, SS_3_PIN, SS_4_PIN};
//byte ssPins[] = {SS_1_PIN, SS_2_PIN};

// Create an MFRC522 instance :
MFRC522 mfrc522[NR_OF_READERS];


// Prepare storage for uidString when it's read
// (copying from https://www.electronics-lab.com/project/rfid-rc522-arduino-uno-oled-display/)
byte uidLength = 11;
String uidString;
/**
   Initialize.
*/
void setup() {

  Serial.begin(9600);           // Initialize serial communications with the PC
  while (!Serial);              // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)

  SPI.begin();                  // Init SPI bus


  /* looking for MFRC522 readers */
  for (uint8_t reader = 0; reader < NR_OF_READERS; reader++) {
    mfrc522[reader].PCD_Init(ssPins[reader], RST_PIN);
    Serial.print(F("Reader "));
    Serial.print(reader + 1);
    Serial.print(F(": "));
    mfrc522[reader].PCD_DumpVersionToSerial();
    //mfrc522[reader].PCD_SetAntennaGain(mfrc522[reader].RxGain_max);
  }
}

/*
   Main loop.
*/

void loop() {

//  for (uint8_t reader = 0; reader < NR_OF_READERS; reader++) {
  for (int reader = 0; reader < NR_OF_READERS; reader++) {  // AZ: changed to int from uint8_t

    // Looking for new cards
    if (mfrc522[reader].PICC_IsNewCardPresent() && mfrc522[reader].PICC_ReadCardSerial()) {
      Serial.print(F("Reader "));
      Serial.print(reader + 1);

      // if card is read on a reader, set readerPositionLabel depending on which reader.
      switch (reader) {
        case 0:
          readerPositionLabel = "TOP";
          break;
        case 1:
          readerPositionLabel = "LEFT";
          break;
        case 2:
          readerPositionLabel = "RIGHT";
          break;
        case 3:
          readerPositionLabel = "BOTTOM";
          break;
      };

      // Show some details of the PICC (that is: the tag/card)
      Serial.print(F(": Card UID:"));
      dump_byte_array(mfrc522[reader].uid.uidByte, mfrc522[reader].uid.size); // AZ: this just prints it (and is working)
      Serial.println();

      //Angele
      // Store the card UID as a String to compare to what we have in array (i think this is what we need to do)
      // doing this in dump_byte_array below


//      for (int x = 0; x < sizeof(tagarray); x++)                  // tagarray's row

// commented out since only looking at one row at a time
//      for (int x = 0; x < NR_OF_READERS; x++)                  // tagarray's row (was going over with sizeof ???
//      {

//        for (int i = 0; i < mfrc522[reader].uid.size; i++)        //tagarray's columns
//        for (int i = 0; i < (sizeof(tagarray[x]) / 10 ); i++)        //tagarray's columns

// changing it to only look at the array of the reader's array, so changing everywhere it used to say x to reader
        for (int i = 0; i < (sizeof(tagarray[reader]) / 10 ); i++)        //tagarray's columns
        {
          Serial.print(F("comparing uidString to tag in array.. "));
          Serial.println();
          Serial.print(F("reader id: "));
          Serial.print(reader);
          Serial.println();          
          Serial.print(F("i/column: "));
          Serial.print(i);
          Serial.println();
          Serial.print(F("tagarray[reader][i]: "));
          Serial.print(tagarray[reader][i]);
          Serial.println();
          Serial.print(F("sizeof tagarray[reader] / 10: "));
          Serial.print(sizeof(tagarray[reader]) / 10);
          Serial.println();
          Serial.print(F("uidString.compareTo(tagarray[reader][i]): "));
          Serial.print(uidString.compareTo(tagarray[reader][i]));
          Serial.println();
          
//          if ( mfrc522[reader].uid.uidByte[i] != tagarray[x][i])  //Comparing the UID in the buffer to the UID in the tag array.
          if ( uidString.compareTo(tagarray[reader][i]) == 0)  //Comparing the UID in the buffer to the UID in uidString (from rfid)
          {
            Serial.print("tag allowed");
            AllowTag();
//            break;
//or continue?? to check other rows?
            break;
          }
          else
          {
//            if (i == mfrc522[reader].uid.size - 1)                // Test if we browesed the whole UID.
//            {
              DenyingTag();                                         // Just allow the tag if it got a 0 in string comparison
              // i think?
              continue;
//            }
//            else
//            {
//              continue;                                           // We still didn't reach the last cell/column : continue testing!
//            }
          }
          if (access) break;                                        // If the Tag is allowed, quit the test.
//          uidString = "";                                           // AZ: otherwise, reset uidString to "" // apparently the wrong place for this...
        }
//        if (access) break;                                        // If the Tag is allowed, quit the test.
//      }


      if (access)
      {
        if (tagcount == NR_OF_READERS)
        {
          OpenDoor();
        }
        else
        {
          MoreTagsNeeded();
        }
      }
      else
      {
        UnknownTag();
      }
      /*Serial.print(F("PICC type: "));
        MFRC522::PICC_Type piccType = mfrc522[reader].PICC_GetType(mfrc522[reader].uid.sak);
        Serial.println(mfrc522[reader].PICC_GetTypeName(piccType));*/
      // Halt PICC
      mfrc522[reader].PICC_HaltA();
      // Stop encryption on PCD
      mfrc522[reader].PCD_StopCrypto1();
    } //if (mfrc522[reader].PICC_IsNewC..
  } //for(uint8_t reader..
  uidString = "";                                                   // AZ: reset uidString to "" before it reloops
  readerPositionLabel = "";                                         // same for these 2
  tokenNumberLabel = 0;                                       
}

/**
   Helper routine to dump a byte array as hex values to Serial.
*/
void dump_byte_array(byte * buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], HEX);
//    https://arduino.stackexchange.com/questions/53258/how-to-store-an-rfid-tag-number-in-a-string
    String uid_part = String(buffer[i], HEX);
//    Serial.print(uid_part);
//    Serial.println();
    uid_part.toUpperCase();
    uidString += uid_part;
  }
  Serial.print(F("uidString:"));
  Serial.print(uidString);
}

void printTagcount() {
  Serial.print("Tag n°");
  Serial.println(tagcount);
}

void DenyingTag()
{
  tokenNumberLabel += 1;
  tagcount = tagcount;
  access = false;
}

void AllowTag()
{
  tokenNumberLabel += 1;
  tagcount = tagcount + 1;
  access = true;
  // TO-DO: make a serial message out of the current reader (readerLabel depends on reader #, here)
  // AND tokenNumberLabel (which is the token number in the array, created by adding 1 each time a card is denied)    \
  // tokenNumberLabel.toString() or something
  String message = readerPositionLabel + String(tokenNumberLabel); // (will give something like "TOP1"
  // convert C++ String into C string (array of characters) in order to use Serial.write
  // https://stackoverflow.com/questions/16290981/how-to-transmit-a-string-on-arduino
  char* buf = (char*) malloc(sizeof(char)*message.length()+1);
  // using toCharArray
  message.toCharArray(buf, message.length()+1);
  // freeing the memory
  Serial.println(message);
}

void Initialize()
{
  tagcount = 0;
  access = false;
}

void OpenDoor()
{
  Serial.println("Welcome! the door is now open");
}

void MoreTagsNeeded()
{
}

void UnknownTag()
{
  Serial.println("This Tag isn't allowed!");
  printTagcount();
}

// used sketch base from https://github.com/Annaane/MultiRfid

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
#define SS_1_PIN        10   // "Top"
#define SS_2_PIN        8    // "Left"
#define SS_3_PIN        7    // "Right"
#define SS_4_PIN        6    // "Bottom"


// List of Tags UIDs // AZ: that are allowed for each reader
// TO-DO: ? change these into byte sized hex versions? possible? would have to rewrite cards??? idk!
String tagarray[][12] = {
// TO-DO: make the uidString variable have spaces in it, ie: read it in the same way dumpinfo works
// no spaces in between to match uidString
  {"CC426D31", "4CF96C31", "AC966D31", "3C646D31", "7C146D31", "1CA86D31"}, // "TOP"
  {"FCAB6D31", "4CD16D31", "3CCF6D31", "5CDC6D31"},                        // "LEFT"
  {"CC546C31", "C996C31", "3C1D6C31", "DC4E6C31"},                        // "RIGHT"
  // to-do: find out why leading 0 not going into uidString (for *0*CA66B31 below)
  {"DCC96431", "2C0D6531", "CCA16631", "BCB56531", "AC6E6531", "FC616431", "CA66B31", "5C426631", "BCAF6531", "7C0A6631", "EC676431", "7CDB6B31" }, // "BOTTOM"  
};

// AZ: Serial Message Parts : 

String readerPositionLabel = "";
int tokenNumberLabel = 0;

// other things

bool validCard = false;

#define NR_OF_READERS   4

byte ssPins[] = {SS_1_PIN, SS_2_PIN, SS_3_PIN, SS_4_PIN}; 

// Create an MFRC522 instance :
MFRC522 mfrc522[NR_OF_READERS];


// Prepare storage for uidString when it's read
// (copying from https://www.electronics-lab.com/project/rfid-rc522-arduino-uno-oled-display/)
String uidString;

/**
   Initialize.
*/
void setup() {

  Serial.begin(9600);           // Initialize serial communications with the PC
  while (!Serial);              // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)

  SPI.begin();                  // Init SPI bus
  delay(4);

  /* looking for MFRC522 readers */
  for (uint8_t reader = 0; reader < NR_OF_READERS; reader++) {
    mfrc522[reader].PCD_Init(ssPins[reader], RST_PIN);

// TO-DO: make the app read a message sent from here saying the readers are all connected
//    Serial.print(F("Checking Reader "));
//    Serial.print(reader + 1);
//    Serial.print(F(": "));
    mfrc522[reader].PCD_DumpVersionToSerial();
    mfrc522[reader].PCD_SetAntennaGain(mfrc522[reader].RxGain_max);
  }

}

/*
   Main loop.
*/

void loop() {

//  for (uint8_t reader = 0; reader < NR_OF_READERS; reader++) {
  for (uint8_t reader = 0; reader < NR_OF_READERS; reader++) {  // AZ: changed to int from uint8_t
    // Looking for new cards
//      Serial.print(F("Checking Reader "));
//      Serial.print(reader + 1);
//      Serial.println();
    if (mfrc522[reader].PICC_IsNewCardPresent() && mfrc522[reader].PICC_ReadCardSerial()) {
//      Serial.print(F("Checking Reader "));
//      Serial.print(reader + 1);
//      Serial.println();

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
//      Serial.print(F(": Card UID:"));
      dump_byte_array(mfrc522[reader].uid.uidByte, mfrc522[reader].uid.size); // AZ: this saves the read card's UID as a string into uidString
//      Serial.println();
//      Serial.println(uidString);

// Look at each UID in the chosen reader's array
      for (int i = 0; i < (sizeof(tagarray[reader]) / sizeof(tagarray[reader][0]) ); i++)        //tagarray's columns
        
        {
          if ( uidString.compareTo(tagarray[reader][i]) == 0)  //Comparing the UID in the buffer to the UID in uidString (from rfid)
          {
            AllowTag();
            break;
          }
          else
          {
//              DenyingTag();                                         // Just allow the tag if it got a 0 in string comparison
            tokenNumberLabel += 1;
            continue;
          }
        }

        if (!validCard) {
          UnknownTag();
        }
        
//      if (access)
//      {
//        if (tagcount == NR_OF_READERS)
//        {
//          OpenDoor();
//        }
//        else
//        {
//          MoreTagsNeeded();
//        }
//      }
//      else
//      {
//        UnknownTag();
//      }
      /*Serial.print(F("PICC type: "));
        MFRC522::PICC_Type piccType = mfrc522[reader].PICC_GetType(mfrc522[reader].uid.sak);
        Serial.println(mfrc522[reader].PICC_GetTypeName(piccType));*/
      // Halt PICC
      mfrc522[reader].PICC_HaltA();
      // Stop encryption on PCD
      mfrc522[reader].PCD_StopCrypto1();
    } //if (mfrc522[reader].PICC_IsNewC..
  } //for(uint8_t reader..
  reinitialize();                        
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
    uid_part.toUpperCase();
    uidString += uid_part;
  }
}

//void DenyingTag()
//{
//  tokenNumberLabel += 1;
//}

void AllowTag()
{
  validCard = true;
  tokenNumberLabel += 1;
  String message = readerPositionLabel + String(tokenNumberLabel); // (will give something like "TOP1")
  Serial.println(message);
}

void reinitialize()
{
  uidString = "";                                                   // AZ: reset uidString to "" before it reloops
  readerPositionLabel = "";                                         // same for these 2
  tokenNumberLabel = 0;       
  validCard = false;        
}


void MoreTagsNeeded()
{
}

void UnknownTag()
{
  String message = readerPositionLabel + String("wrong"); // (will give something like "TOP1")
  Serial.println(message);
}

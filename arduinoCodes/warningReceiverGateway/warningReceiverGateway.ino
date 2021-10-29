//#include <config.h>
#include <SPI.h>
#include <LoRa.h>
#include <ArduinoJson.h>

#define BAUDRATE 115200
#include<Console.h>
#include "HttpClient.h"

int talkBackCommand;
int charIn = 0; 

#include <LCD_I2C.h>
LCD_I2C lcd(0x27); // Default address of most PCF8574 modules, change according

void setup() {
  //Serial.begin(9600);
  Bridge.begin(BAUDRATE);
  Console.begin();
  lcd.begin();
  lcd.backlight();
  //while (!Serial);
  Console.println(" ");
  Console.println("LoRa Receiver");

  if (!LoRa.begin(868100000)) {
    Console.println("Starting LoRa failed!");
    while (1);
  }
  else{
    Console.println("Initiation Complete");
  }
  LoRa.setSpreadingFactor(7);
}

void loop() {
  // try to parse packet
  int packetSize = LoRa.parsePacket();
  String message = "";
  char character ;
  if (packetSize) {
    // received a packet
    Console.print("Received packet '");

    // read packet
    while (LoRa.available()) {
      character = (char)LoRa.read();
      message.concat(character);
      
    }

    // print RSSI of packet
    Console.print(message);
    Console.print("' with RSSI ");
    Console.println(LoRa.packetRssi());
    String rtkStatus = message.substring(0,2);
    String stationId =message.substring(2,6);
    String waterlevel = message.substring(6,message.length());
    Console.print("stationId: ");
    Console.println(stationId);
    Console.print("Water Level: ");
    Console.println(waterlevel);
    action(rtkStatus,stationId,waterlevel);
  }
}

void action(String rtkStatus,String stationId , String waterLevel){
  
  float safeLimit =136.0;
  float dangerLimit = 141.0;
  String waterLevelState ="green";

  //for display on LCD
  displayLevel(waterLevel);

  //For the Warning lights
  if(waterLevel.toFloat()>=dangerLimit){
    waterLevelState="red";
  }
  else if(waterLevel.toFloat()< dangerLimit && waterLevel.toFloat() >= safeLimit){
    waterLevelState="yellow";
  }
  else if(waterLevel.toFloat()< safeLimit){
    waterLevelState = "green";
  }
  else{
    waterLevelState= "something Else";
  }
  waterLevelWarning(waterLevelState);

  //RtkStatus
  rtkStatusWarning(rtkStatus);

  //towardsPortal
  towardsPortal(rtkStatus, stationId,waterLevel,waterLevelState);
}

void displayLevel(String waterlevel){
  //Serial.print("Water Level: ");
  //Serial.println(waterlevel);
  lcd.clear();
  lcd.print(waterlevel);
}

void waterLevelWarning(String status){
  if(status == "red"){
    analogWrite(A0,255);
    analogWrite(A1,0);
    analogWrite(A2,0);
  }
  else if(status == "yellow"){
    analogWrite(A0,0);
    analogWrite(A1,255);
    analogWrite(A2,0);
  }
  else if(status == "green"){
    analogWrite(A0,0);
    analogWrite(A1,0);
    analogWrite(A2,255);
  }
  else{
    analogWrite(A0,0);
    analogWrite(A1,0);
    analogWrite(A2,0);
    Serial.println("Warning Level not decodable");
  }
}

void rtkStatusWarning(String rtkStatus){
  Console.print("RTK Status: ");
  Console.println(rtkStatus);
  if(rtkStatus=="01"){
    Console.println("RTK Float");
    for(int i=0;i<5;i++){
      analogWrite(A3,255);
      delay(50);
      analogWrite(A3,0);
      delay(50);
      
    }
  }
  else if(rtkStatus=="10"){
    analogWrite(A3,255);
    Console.println("RTK Fixed");
  }
  else{
    analogWrite(A3,0);
    Console.println("No RTK");
  }
}

void towardsPortal(String rtkStatus, String stationId,String waterLevel,String waterLevelState){
  StaticJsonDocument<200> jsonMessage;
  jsonMessage["rtkStatus"]=rtkStatus;
  jsonMessage["StationId"]=stationId;
  jsonMessage["waterLevel"]=waterLevel;
  jsonMessage["waterLevelState"]=waterLevelState;
  jsonMessage["latitude"]=50.135674;
  jsonMessage["longitude"]=9.178864;
  //serializeJson(jsonMessage, Bridge);
  HttpClient client;
  String url = "https://waterlevelwamo.herokuapp.com/";
  String data = "";
  serializeJson(jsonMessage, data);
  Console.print("Data for server:");
  Console.println(data);
  int j = client.post(url,data);
  delay(200);
  /*
   charIn = 0;
    talkBackCommand = 0;
    
    while (client.available())
    {
        charIn = client.read();//
        talkBackCommand += charIn;
    }

    Console.print("Get Response from Server: ");
    Console.println(talkBackCommand);
    */
    Console.print("Get Response from Server: ");
    Console.println(j);
}

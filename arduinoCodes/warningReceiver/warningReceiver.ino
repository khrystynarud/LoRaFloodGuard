#include <SPI.h>
#include <LoRa.h>
#include <ArduinoJson.h>


#include <LCD_I2C.h>

LCD_I2C lcd(0x27); // Default address of most PCF8574 modules, change according

void setup() {
  Serial.begin(9600);
  lcd.begin();
  lcd.backlight();
  while (!Serial);
  Serial.println(" ");
  Serial.println("LoRa Receiver");

  if (!LoRa.begin(868100000)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
  else{
    Serial.println("Initiation Complete");
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
    Serial.print("Received packet '");

    // read packet
    while (LoRa.available()) {
      character = (char)LoRa.read();
      message.concat(character);
      
    }

    // print RSSI of packet
    Serial.print(message);
    Serial.print("' with RSSI ");
    Serial.println(LoRa.packetRssi());
    String rtkStatus = message.substring(0,2);
    String stationId =message.substring(2,6);
    String waterlevel = message.substring(6,message.length());
    Serial.print("stationId: ");
    Serial.println(stationId);
    Serial.print("Water Level: ");
    Serial.println(waterlevel);
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
  Serial.print("RTK Status: ");
  Serial.println(rtkStatus);
  if(rtkStatus=="01"){
    Serial.println("RTK Float");
    for(int i=0;i<5;i++){
      analogWrite(A3,255);
      delay(50);
      analogWrite(A3,0);
      delay(50);
      
    }
  }
  else if(rtkStatus=="10"){
    analogWrite(A3,255);
    Serial.println("RTK Fixed");
  }
  else{
    analogWrite(A3,0);
    Serial.println("No RTK");
  }
}

void towardsPortal(String rtkStatus, String stationId,String waterLevel,String waterLevelState){
  StaticJsonDocument<200> jsonMessage;
  jsonMessage["rtkStatus"]=rtkStatus;
  jsonMessage["StationId"]=stationId;
  jsonMessage["waterLevel"]=waterLevel;
  jsonMessage["waterLevelState"]=waterLevelState;
  serializeJson(jsonMessage, Serial);
}

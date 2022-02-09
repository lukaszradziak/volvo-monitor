#include "OBD.h"
#include <Arduino.h>

CAN_device_t CAN_cfg;
CAN_frame_t rxFrame, txFrame;

char rxString[8];
byte klineBuff[7] = {0x84, 0x40, 0x13, 0xB2, 0xF0, 0x03, 0x7C};

void OBD::begin(gpio_num_t canRx, gpio_num_t canTx, gpio_num_t klineTx) {
  this->canTx = canTx;
  this->canRx = canRx;
  this->klineTx = klineTx;

  Serial1.begin(10800, SERIAL_8N1, -1, this->klineTx, true);
}

void OBD::canOpen(String speed) {
  this->canClose();

  if(speed == "125"){
    CAN_cfg.speed = CAN_SPEED_125KBPS;
  } else if(speed == "250"){
    CAN_cfg.speed = CAN_SPEED_250KBPS;
  } else if(speed == "500"){
    CAN_cfg.speed = CAN_SPEED_500KBPS;
  }

  CAN_cfg.tx_pin_id = this->canTx;
  CAN_cfg.rx_pin_id = this->canRx;
  CAN_cfg.rx_queue = xQueueCreate(10,sizeof(CAN_frame_t));
  ESP32Can.CANInit();
}

void OBD::canClose(){
  ESP32Can.CANStop();
}

void OBD::canWrite(uint32_t id, byte byte0, byte byte1, byte byte2, byte byte3, byte byte4, byte byte5, byte byte6, byte byte7){
  txFrame.FIR.B.FF = CAN_frame_ext;
  txFrame.MsgID = id;
  txFrame.FIR.B.DLC = 8;
  txFrame.data.u8[0] = byte0;
  txFrame.data.u8[1] = byte1;
  txFrame.data.u8[2] = byte2;
  txFrame.data.u8[3] = byte3;
  txFrame.data.u8[4] = byte4;
  txFrame.data.u8[5] = byte5;
  txFrame.data.u8[6] = byte6;
  txFrame.data.u8[7] = byte7;
  ESP32Can.CANWriteFrame(&txFrame);
}

String OBD::canTest(String canSpeed, byte canHex, int parameter){
  String response = "";

  this->canOpen(canSpeed);
  this->canWrite(0x0FFFFE, 0xD8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00);
  delay(30UL);

  this->canWrite(0x0FFFFE, 0xCD, canHex, 0xA6, parameter >> 8 & 0xFF, parameter & 0xFF, 0x01, 0x00, 0x00);

  for(int i = 0; i <= 500; i++){
    if(xQueueReceive(CAN_cfg.rx_queue, &rxFrame, 3*portTICK_PERIOD_MS) == pdTRUE){
      if(rxFrame.data.u8[1] == canHex && (rxFrame.data.u8[2] == 0xE6 || rxFrame.data.u8[2] == 0x7F)){
        sprintf(rxString, "0x%.8lX", (rxFrame.MsgID & 0x1FFFFFFF), rxFrame.FIR.B.DLC);
        response = response + rxString;

        for(int i = 0; i < 8; i++){
          sprintf(rxString, ",0x%.2X", rxFrame.data.u8[i]);
          response = response + rxString;
        }

        Serial.println(response);
        break;
      }
    }
  }

  this->canClose();
  return response;
}

void OBD::canMonitorStart(String canSpeed, byte canAddress, byte canInterval, int parameters[], int parametersSize){
  this->canOpen(canSpeed);
  this->canWrite(0x0FFFFE, 0xD8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00);
  delay(100UL);

  this->canMonitorActive = true;
  this->canMonitorAddress = canAddress;

  for(int i = 0; i < parametersSize; i++){
    this->canWrite(0x0FFFFE, 0xCD, canAddress, 0xA6, parameters[i] >> 8 & 0xFF, parameters[i] & 0xFF, canInterval, 0x00, 0x00);
    delay(100UL);
  }
}

void OBD::canMonitorStop(){
  this->canWrite(0x0FFFFE, 0xCA, this->canMonitorAddress, 0xA0, 0x00, 0x00, 0x00, 0x00, 0x00);
  delay(100UL);
  this->canMonitorActive = false;
}

String OBD::canMonitorData(){
  String result = "";

  if(this->canMonitorActive){
    if(xQueueReceive(CAN_cfg.rx_queue, &rxFrame, 3*portTICK_PERIOD_MS) == pdTRUE){
      if(rxFrame.data.u8[1] == this->canMonitorAddress && rxFrame.data.u8[2] == 0xE6){
        result += String(millis());

        for(int i = 0; i < 8; i++){
          sprintf(rxString, ",0x%.2X", rxFrame.data.u8[i]);
          result += rxString;
        }

        Serial.println(result);
        result += "\n";
      }
    }
  }

  return result;
}

void OBD::klineWrite(){
  Serial1.write(klineBuff, 7);
}
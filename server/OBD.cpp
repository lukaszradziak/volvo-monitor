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

void OBD::canOpen(int speed) {
  this->canClose();

  printf("open %i\n", speed);

  if(speed == 125){
    CAN_cfg.speed = CAN_SPEED_125KBPS;
  } else if(speed == 250){
    CAN_cfg.speed = CAN_SPEED_250KBPS;
  } else if(speed == 500){
    CAN_cfg.speed = CAN_SPEED_500KBPS;
  }

  CAN_cfg.tx_pin_id = this->canTx;
  CAN_cfg.rx_pin_id = this->canRx;
  CAN_cfg.rx_queue = xQueueCreate(50, sizeof(CAN_frame_t));

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

void OBD::canDiag(){
  this->canWrite(0x0FFFFE, 0xD8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00);
  delay(30UL);
}

String OBD::canTest(int canSpeed, int canHex, int parameter){
  String response = "";

  this->canOpen(canSpeed);
  this->canDiag();

  this->canWrite(0x0FFFFE, 0xCD, canHex, 0xA6, parameter >> 8 & 0xFF, parameter & 0xFF, 0x01, 0x00, 0x00);

  for(int i = 0; i <= 500; i++){
    if(xQueueReceive(CAN_cfg.rx_queue, &rxFrame, 3*portTICK_PERIOD_MS) == pdTRUE){
      if(rxFrame.data.u8[1] == canHex && (rxFrame.data.u8[2] == 0xE6 || rxFrame.data.u8[2] == 0x7F)){
        sprintf(rxString, "0,%08X", (rxFrame.MsgID & 0x1FFFFFFF));
        response = response + rxString;

        for(int i = 0; i < 8; i++){
          sprintf(rxString, ",%02X", rxFrame.data.u8[i]);
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

void OBD::canMonitorStart(int canSpeed, int canAddress, int canInterval, int parameters[], int parametersSize){
  this->canClose();
  delay(30UL);

  this->canOpen(canSpeed);
  this->canDiag();

  this->canMonitorActive = true;
  this->canMonitorAddress = canAddress;
  this->canMonitorData = 0xE6;

  for(int i = 0; i < parametersSize; i++){
    this->canWrite(0x0FFFFE, 0xCD, canAddress, 0xA6, parameters[i] >> 8 & 0xFF, parameters[i] & 0xFF, canInterval, 0x00, 0x00);
    delay(30UL);
  }
}

void OBD::canMonitorStop(){
  this->canWrite(0x0FFFFE, 0xCA, this->canMonitorAddress, 0xA0, 0x00, 0x00, 0x00, 0x00, 0x00);
  delay(100UL);
  this->canMonitorActive = false;
  this->canMonitorAddress = -1;
  this->canMonitorData = -1;
}

void OBD::canSnifferStart(int canSpeed, int filter[8]){
  this->canClose();
  delay(30UL);

  this->canOpen(canSpeed);

  CAN_filter_t p_filter;
  p_filter.FM = Single_Mode;

  p_filter.ACR0 = filter[0];
  p_filter.ACR1 = filter[1];
  p_filter.ACR2 = filter[2];
  p_filter.ACR3 = filter[3];
  p_filter.AMR0 = filter[4];
  p_filter.AMR1 = filter[5];
  p_filter.AMR2 = filter[6];
  p_filter.AMR3 = filter[7];
  ESP32Can.CANConfigFilter(&p_filter);
  ESP32Can.CANInit();

  this->canSnifferActive = true;
}

void OBD::canSnifferStop(){
  this->canSnifferActive = false;
  this->canClose();
}

String OBD::canDtcRead(int canSpeed, int canAddress){
  String response = "";

  this->canOpen(canSpeed);

  this->canDiag();
  this->canWrite(0x0FFFFE, 0xCB, canAddress, 0xAE, 0x1B, 0x00, 0x00, 0x00, 0x00);

  uint32_t canId = 0;

  for(int i = 0; i <= 1000; i++){
    if(xQueueReceive(CAN_cfg.rx_queue, &rxFrame, 3*portTICK_PERIOD_MS) == pdTRUE){

      if(rxFrame.data.u8[1] == canAddress || (canId != 0 && canId == rxFrame.MsgID)){
        if(canId == 0){
          canId = rxFrame.MsgID;
        }

        sprintf(rxString, "%ld,%08X", millis(), (rxFrame.MsgID & 0x1FFFFFFF));
        response += rxString;

        for(int i = 0; i < 8; i++){
          sprintf(rxString, ",%02X", rxFrame.data.u8[i]);
          response += rxString;
        }

        response += "\n";

      }

      if(rxFrame.data.u8[0] == 0x4E && canId != 0 && canId == rxFrame.MsgID){
        break;
      }
    }
  }

  Serial.println(response);

  this->canClose();
  return response;
}

void OBD::canDtcClear(int canSpeed, int canAddress){
  this->canOpen(canSpeed);

  this->canDiag();
  this->canWrite(0x0FFFFE, 0xCB, canAddress, 0xAE, 0x11, 0x00, 0x00, 0x00, 0x00);
  delay(500UL);

  this->canClose();
}

String OBD::canData(){
  String result = "";

  if(xQueueReceive(CAN_cfg.rx_queue, &rxFrame, 3*portTICK_PERIOD_MS) == pdTRUE){
    if((this->canMonitorAddress == -1 && this->canMonitorData == -1) || (rxFrame.data.u8[1] == this->canMonitorAddress && rxFrame.data.u8[2] == this->canMonitorData)){
      sprintf(rxString, "%ld,%08X", millis(), (rxFrame.MsgID & 0x1FFFFFFF));
      result += rxString;
      for(int i = 0; i < 8; i++){
        sprintf(rxString, ",%02X", rxFrame.data.u8[i]);
        result += rxString;
      }

      // Serial.println(result);
      result += "\n";
    }
  }

  return result;
}

bool OBD::canAvailable(){
  return this->canMonitorActive || this->canSnifferActive;
}

void OBD::klineWrite(){
  Serial1.write(klineBuff, 7);
}
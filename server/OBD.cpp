#include "OBD.h"
#include <Arduino.h>

void OBD::begin(gpio_num_t canRx, gpio_num_t canTx, gpio_num_t klineTx) {
  this->canTx = canTx;
  this->canRx = canRx;
  this->klineTx = klineTx;

  Serial1.begin(10800, SERIAL_8N1, -1, this->klineTx, true);
}

void OBD::canOpen(String speed) {
  Serial.println("OBD init");
  ESP32Can.CANStop();

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

void OBD::canStop(){
  ESP32Can.CANStop();
}

void OBD::canWrite(uint32_t id, uint8_t byte0, uint8_t byte1, uint8_t byte2, uint8_t byte3, uint8_t byte4, uint8_t byte5, uint8_t byte6, uint8_t byte7){
  CAN_frame_t tx_frame;
  
  tx_frame.FIR.B.FF = CAN_frame_ext;
  tx_frame.MsgID = id;
  tx_frame.FIR.B.DLC = 8;
  tx_frame.data.u8[0] = byte0;
  tx_frame.data.u8[1] = byte1;
  tx_frame.data.u8[2] = byte2;
  tx_frame.data.u8[3] = byte3;
  tx_frame.data.u8[4] = byte4;
  tx_frame.data.u8[5] = byte5;
  tx_frame.data.u8[6] = byte6;
  tx_frame.data.u8[7] = byte7;
  ESP32Can.CANWriteFrame(&tx_frame);
}

String OBD::canTest(int canHex, int parameter1, int parameter2){
  String canResponse = "";
  char msgString[128];
  CAN_frame_t rx_frame;

  this->canWrite(0x0FFFFE, 0xD8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00);
  delay(30);
  this->canWrite(0x0FFFFE, 0xCD, canHex, 0xA6, parameter1, parameter2, 0x01, 0x00, 0x00);

  for(int i = 0; i <= 500; i++){
    if(xQueueReceive(CAN_cfg.rx_queue, &rx_frame, 3*portTICK_PERIOD_MS) == pdTRUE){
      if(rx_frame.data.u8[1] == canHex && (rx_frame.data.u8[2] == 0xE6 || rx_frame.data.u8[2] == 0x7F)){
        sprintf(msgString, "0x%.8lX", (rx_frame.MsgID & 0x1FFFFFFF), rx_frame.FIR.B.DLC);
        canResponse = canResponse + msgString;

        for(int i = 0; i < 8; i++){
          sprintf(msgString, ",0x%.2X", rx_frame.data.u8[i]);
          canResponse = canResponse + msgString;
        }

        Serial.println(canResponse);

        break;
      }
    }
  }

  return canResponse;
}

String OBD::canMonitor(int canAddressHex, int canIntervalHex, int parameters[10][2]){
  String result = "";
  char msgString[128];
  CAN_frame_t rx_frame;

  this->canWrite(0x0FFFFE, 0xD8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00); // start diag
  delay(30UL);

  for(int i = 0; i < 10; i++){
    if(parameters[i][0] != 0 && parameters[i][1] != 0){
      printf(">>>>> %02x - %02x\n", parameters[i][0], parameters[i][1]);
      this->canWrite(0x0FFFFE, 0xCD, canAddressHex, 0xA6, parameters[i][0], parameters[i][1], canIntervalHex, 0x00, 0x00);
      delay(30UL);
    }
  }

  for(int i = 0; i < 1000; i++){
    if(xQueueReceive(CAN_cfg.rx_queue, &rx_frame, 3*portTICK_PERIOD_MS) == pdTRUE){
      if(rx_frame.data.u8[1] == canAddressHex){

        String canResponse = String(millis());

        for(int i = 0; i < 8; i++){
          sprintf(msgString, ",0x%.2X", rx_frame.data.u8[i]);
          canResponse = canResponse + msgString;
        }

        Serial.print(canResponse);
        Serial.println();

        result += canResponse + "\n";
      }
    }
  }

  this->canWrite(0x0FFFFE, 0xCA, canAddressHex, 0xA0, 0x00, 0x00, 0x00, 0x00, 0x00); // stop sending
  
  return result;
}

void OBD::klineWrite(){
  byte klineBuff[7] = {0x84, 0x40, 0x13, 0xB2, 0xF0, 0x03, 0x7C};
  Serial1.write(klineBuff, 7);
}
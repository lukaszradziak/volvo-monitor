#include <Arduino.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include "SPIFFS.h"

#include <ESP32CAN.h>
#include <CAN_config.h>

#define WIFI_SSID "VolvoMonitor"
#define WIFI_PASS "12345678"

CAN_device_t CAN_cfg;
AsyncWebServer server(80);
String monitorData = "";

void canWrite(uint32_t id, uint8_t byte0, uint8_t byte1, uint8_t byte2, uint8_t byte3, uint8_t byte4, uint8_t byte5, uint8_t byte6, uint8_t byte7){
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

void task0(void* param){
  byte klineBuff[7] = {0x84, 0x40, 0x13, 0xB2, 0xF0, 0x03, 0x7C};

  while(true){
    Serial1.write(klineBuff, 7);
    vTaskDelay(2000UL);
  }
}

void task1(void* param){
  while(true){
    if(monitorData.length() > 10000){
      monitorData = "";
    }
    monitorData += millis();
    monitorData += ";";
    monitorData += "test";
    monitorData += "\n";

    vTaskDelay(100UL);
  }
}

void setup() {
  Serial.begin(115220);
  Serial1.begin(10800, SERIAL_8N1, 13, 12, true);
  printf("Hello Volvo Monitor!\n");

  SPIFFS.begin(true);
  WiFi.setSleep(false);
  WiFi.mode(WIFI_STA);
  WiFi.softAP(WIFI_SSID, WIFI_PASS);

  IPAddress IP = WiFi.softAPIP();
  printf("Address ip: %s\n", IP.toString().c_str());

  server.on("/api/monitor-data", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "text/plain", monitorData);
    monitorData = "";
  });

  server.on("/api/monitor/test", HTTP_POST, [](AsyncWebServerRequest *request){
    String canSpeed = request->arg("canSpeed");
    String canAddress = request->arg("canAddress");
    String address = request->arg("address");

    printf("Monitor test: %s - %s - %s\n", canSpeed, canAddress, address);

    ESP32Can.CANStop();

    if(canSpeed == "125"){
      CAN_cfg.speed = CAN_SPEED_125KBPS;
    } else if(canSpeed == "250"){
      CAN_cfg.speed = CAN_SPEED_250KBPS;
    } else if(canSpeed == "500"){
      CAN_cfg.speed = CAN_SPEED_500KBPS;
    }
    CAN_cfg.tx_pin_id = GPIO_NUM_5;
    CAN_cfg.rx_pin_id = GPIO_NUM_4;
    CAN_cfg.rx_queue = xQueueCreate(10,sizeof(CAN_frame_t));
    ESP32Can.CANInit();

    int canHex = strtoul(canAddress.c_str(), NULL, 16);
    int parameter = strtoul(address.c_str(), NULL, 16);
    int parameter1 = parameter >> 8 & 0xFF;
    int parameter2 = parameter & 0xFF;

    canWrite(0x0FFFFE, 0xD8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00);
    delay(30);
    canWrite(0x0FFFFE, 0xCD, canHex, 0xA6, parameter1, parameter2, 0x01, 0x00, 0x00);

    CAN_frame_t rx_frame;
    String canResponse = "";
    char msgString[128];

    for(int i = 0; i < 100; i++){
      if(xQueueReceive(CAN_cfg.rx_queue, &rx_frame, 3*portTICK_PERIOD_MS) == pdTRUE){
        
        if(rx_frame.data.u8[1] == canHex && rx_frame.data.u8[2] == 0xE6){
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

    ESP32Can.CANStop();
    request->send(200, "application/json", canResponse);
  });

  server
    .serveStatic("/", SPIFFS, "/")
    .setDefaultFile("index.html")
    .setCacheControl("max-age=600");

  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  server.begin();

  xTaskCreatePinnedToCore(task0, "Task0", 4096, NULL, 1, NULL, 0);
  xTaskCreatePinnedToCore(task1, "Task1", 4096, NULL, 1, NULL, 1);
}

void loop() {

}
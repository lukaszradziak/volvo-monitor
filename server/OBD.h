#ifndef OBD_h
#define OBD_h

#include <Arduino.h>
#include <ESP32CAN.h>
#include <CAN_config.h>

class OBD {
  private:
    gpio_num_t canTx;
    gpio_num_t canRx;
    gpio_num_t klineTx;
    
  public:
    void begin(gpio_num_t canTx, gpio_num_t canRx, gpio_num_t klineTx);
    void canOpen(String speed);
    void canStop();
    void canWrite(uint32_t id, uint8_t byte0, uint8_t byte1, uint8_t byte2, uint8_t byte3, uint8_t byte4, uint8_t byte5, uint8_t byte6, uint8_t byte7);
    String canTest(int canHex, int parameter1, int parameter2);
    String canMonitor(int canAddressHex, int canIntervalHex, int parameters[10][2]);
    void klineWrite();
};

#endif
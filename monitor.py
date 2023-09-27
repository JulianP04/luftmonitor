#imports
import numpy as np
from time import sleep
from gpiozero import LED
import board
from busio import I2C
import adafruit_bme680
import mysql.connector
from datetime import datetime
import mh_z19

#init sensor object
i2c = I2C(board.SCL, board.SDA)
bme680 = adafruit_bme680.Adafruit_BME680_I2C(i2c, debug=False)
temperature_offset = -7

#connect to db
print("Establishing db connection")
connection = mysql.connector.connect(host= "172.16.129.103", user = "raspberry", password = "Monitor#2023", db = "monitor") #change host!!
measurementsDB = connection.cursor()

#init measurement array
all_measurements = np.array([])

print(mh_z19.read_all())

#init led gpios
#ledRed = LED(19)
#ledYellow = LED(20)
#ledGreen = LED(21)

#calculate the average of an array
def calc_average(array):
    global all_measurements
    sum = 0
    for i in range(0,len(array)):
        sum += array[i]
    average = sum / len(array)
    all_measurements = np.append(all_measurements, format(average, '.2f'))
    
def push_to_database():
    global all_measurements
    print("### Pushing data to db")
    
    sql = """INSERT INTO measurements (temperature, humidity, gas, co2, pme, date) VALUES (%s, %s, %s, %s, %s, %s) """
    val = (str(all_measurements[0]), str(all_measurements[1]), str(all_measurements[2]), "--", "--", datetime.now())
    
    measurementsDB.execute(sql, val)
    connection.commit()

    all_measurements = np.array([])
    collect_measurement_data()

def collect_measurement_data():
    print("## Collecting data")
    temp_measurements = np.array([])
    humidity_measurements = np.array([])
    gas_measurements = np.array([])
    
    for i in range(0,3):
        #temperature
        cur_temp = bme680.temperature + temperature_offset
        temp_measurements = np.append(temp_measurements, cur_temp)
        #humidity
        humidity_measurements = np.append(humidity_measurements, bme680.relative_humidity)
        #co
        gas_measurements = np.append(gas_measurements, bme680.gas_resistance)
        #wait 10sec to next measurement
        sleep(10)
    
    calc_average(temp_measurements)
    calc_average(humidity_measurements)
    calc_average(gas_measurements)
    push_to_database()
    
collect_measurement_data()
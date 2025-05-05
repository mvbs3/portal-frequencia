from appium.webdriver.webdriver import WebDriver
from appium.options.android import UiAutomator2Options
from appium.webdriver.common.appiumby import AppiumBy
import time

options = UiAutomator2Options().load_capabilities({
    "platformName": "Android",
    "deviceName": "Android",
    "automationName": "UiAutomator2",
    "appPackage": "com.mazelinhuu.leitorpresenca",
    "appActivity": "com.mazelinhuu.leitorpresenca.MainActivity",
    "autoGrantPermissions": True
})

driver = WebDriver("http://localhost:4723", options=options)


time.sleep(3)

input_box = driver.find_element(AppiumBy.CLASS_NAME, "android.widget.EditText")
input_box.send_keys("https://docs.google.com/spreadsheets/d/1ckTouPiyTTDkdsZeHfbvMRctBQyl2GhiXV_DM3PHlSY/edit?gid=0#gid=0")  

botao_continuar = driver.find_element(AppiumBy.ANDROID_UIAUTOMATOR,
    'new UiSelector().textContains("Continuar")')
botao_continuar.click()

time.sleep(3)

# Fecha o app
driver.quit()

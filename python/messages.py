import requests, json
from py_imessage import imessage

def send():
        adj_response = requests.get('https://random-word-form.herokuapp.com/random/adjective')
        adjective = adj_response.json()[0]  # Convert the response to JSON data

        noun_response = requests.get('https://random-word-form.herokuapp.com/random/noun')
        noun = noun_response.json()[0]  # Convert the response to JSON data
        # Process the data as needed
        
        message = f"Good morning my {adjective} {noun}!"
        # Good morning my unhappy witch! LOL

        phone = '6316013215'
        #guid = imessage.send(phone, message)
        print(message)

# Call the API
send()
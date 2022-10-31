from flask import Flask, render_template, request, jsonify
import mimetypes
import requests
import os
from flask_cors import CORS, cross_origin
mimetypes.add_type("text/css", ".css", True)
app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET', 'POST']) # To render Homepage
def home_page():
    return render_template('index.html')

@app.route('/fiveg', methods=['POST'])  # This will be called from UI
def diabetes_prediction():
    if (request.method=='POST'):
        jitter = request.form['jitter']
        bitrate = request.form['bitrate']
        packetlossrate = request.form['packetlossrate']


        url = "https://ussouthcentral.services.azureml.net/workspaces/ff3b958f513142458fdbe2c36d2d9072/services/e8f54ba59fea4cec8acd440886e1be46/execute?api-version=2.0&format=swagger"

       ## payload = "{\r\n        \"Inputs\": {\r\n                \"input1\":\r\n                [\r\n                    {\r\n                            'Jitter (ms)': \""+ str(jitter) +"\",   \r\n                            'Bit Rate (Mbps)': \""+ str(bitrate) +"\",   \r\n                            'Packet Loss Rate (%)': \""+ str(packetlossrate) +"\",   \r\n                            'Service': \""+  +"\",   \r\n                                               }\r\n                ],\r\n        },\r\n    \"GlobalParameters\":  {\r\n    }\r\n}"

        payload = "{\r\n        \"Inputs\": {\r\n                \"input1\":\r\n                [\r\n                    {\r\n                            'Jitter (ms)': \""+ str(jitter) +"\",   \r\n                            'Bit Rate (Mbps)': \""+ str(bitrate) +"\",   \r\n                            'Packet Loss Rate (%)': \""+ str(packetlossrate) +"\",   \r\n                            'Service': \"\",   \r\n                    }\r\n                ],\r\n        },\r\n    \"GlobalParameters\":  {\r\n    }\r\n}\r\n\r\n"

        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer m9QF/IFGQzr91MYUBa5rpzNLh5eGHTyXY6HPeSDFaL4hT5xjYP/8kbNPUn214Chgzh2O9FByCS6Z+AMCPpinrw=='
        }

        response = requests.request("POST", url, headers=headers, data=payload)
        result = response.text[2:8]
        result += " :          "
        result += response.text[20:171]
        return render_template('results.html', result=result)



port = int(os.getenv("PORT"))
if __name__ == '__main__':
    #app.run(debug=True)
    app.run(host='0.0.0.0', port=port)

# 5GServicePredictor
# Machine Learning-Based Application for Predicting 5G/B5G Service
In a 5G/B5G (Beyond 5G) network, Service level agreement (SLA), network efficiency, and service management are key issues for a network provider. A user equipment requests services (UE) are based on a key performance indicator (KPI) and key quality indicator (KQI) while selecting the network slice. Earlier predicting the benefits of 5G/B5G will be helpful for the service provider to improve the quality of service (QoS). Therefore, we aim to build a data-driven predictive application to screen the multiple services of 5G/B5G. In this context, multi-classification supervised machine learning models are applied to the publicly available dataset to classify the services of 5G/B5G. We performed different simulations with the ML algorithm, first with all features (KPI and KQI parameters), second with alone KPI, and finally with features selection methods. The multiclass Decision jungle (MDJ) model shows better performance in terms of accuracy of 90%, precision, and recall. Moreover, an application programming interface (API) of the MDJ model implemented and deployed in https://predictor5g.herokuapp.com/ and source code are available at https://github.com/tabrejmsc/5GServicePredictor.
### Screenshot
###### Dataset Description
![](/images/datasetdescription.jpg)
###### Flow Diagram
![](/images/flowdiagram.jpg)
# Flask Based Application
![](/images/Application.jpg)
# Prediction Page
![](/images/prediction.jpg)
# Requirements
Boruta==0.3<br/>
Click==7.0<br/>
cycler==0.10.0<br/>
Flask==1.1.1<br/>
gunicorn==19.9.0<br/>
itsdangerous==1.1.0<br/>
Jinja2==2.10.3<br/>
joblib==0.14.0<br/>
kiwisolver==1.1.0<br/>
MarkupSafe==1.1.1<br/>
matplotlib==3.1.1<br/>
numpy==1.17.2<br/>
pyparsing==2.4.2<br/>
python-dateutil==2.8.0<br/>
scikit-learn==0.21.3<br/>
scipy==1.3.1<br/>
six==1.12.0<br/>
sklearn==0.0<br/>
vecstack==0.4.0<br/>
Werkzeug==0.16.0<br/>
xgboost==0.90<br/>
# How to cite ?
M. T. Khan and A. Adholiya, "Machine Learning-Based Application for Predicting 5G/B5G Service," 2023 13th International Conference on Cloud Computing, Data Science & Engineering (Confluence), Noida, India, 2023, pp. 613-619, doi: 10.1109/Confluence56041.2023.10048885.

//import React from 'react';
import i18n from '../constants/Strings'; 

export function CanComputeRisk( data ) {

    var ga = 0; //ga is short for 'good answers'
    
    if ( data.birthyear > 0 ) { ga += 1; }
    if ( data.gender > 0 ) { ga += 1; }
    if ( data.height > 0 ) { ga += 1; }
    if ( data.smoking > 0 ) { ga += 1; }
    if ( data.weight > 0 ) { ga += 1; }
    if ( data.hdlc > 0 ) { ga += 1; }
    if ( data.cholesterol > 0 ) { ga += 1; }
    if ( data.bloodpressure > 0 ) { ga += 1; }
    if ( data.diabetes > 0 ) { ga += 1; }

    if( ga >= 9 ) {
      return true; //yes we have all the info we need
    } else {
      return false; //not enough data
    }
}

export function NumGoodAnswersBasic( data ) {

    var ga = 0;
    
    if ( data.birthyear > 0 ) { ga += 1; }
    if ( data.gender > 0 ) { ga += 1; }
    if ( data.smoking > 0 ) { ga += 1; }
    if ( data.height > 0 ) { ga += 1; }
    if ( data.weight > 0 ) { ga += 1; }
    if ( data.country > 0 ) { ga += 1; }
    if ( data.diabetes > 0 ) { ga += 1; }

    return ga;
}

export function NumGoodAnswersCardio( data ) {

    var ga = 0;
    
    if ( data.hdlc > 0 ) { ga += 1; }
    if ( data.cholesterol > 0 ) { ga += 1; }
    if ( data.bloodpressure > 0 ) { ga += 1; }

    return ga; //yes we have all the info we need

}

export function tenYearRiskLabel( riskScore, gender, birthyear ) {

/*
    var statinTextLow = i18n.t('result_statin_low');
    var statinTextEle = i18n.t('result_statin_elv');
    var statinTextHig = i18n.t('result_statin_hig'); 
    var statinTextSev = i18n.t('result_statin_sev');
*/

    //first let's compute the age
    var age = (new Date().getFullYear()) - birthyear;

//    var statinText = 'unknown';
    var riskText = 'unknown';

/*

https://tools.acc.org/ASCVD-Risk-Estimator-Plus/#!/calculate/estimate/


**10-year risk for ASCVD is categorized as:
Low-risk (<5%)
Borderline risk (5% to 7.4%)
Intermediate risk (7.5% to 19.9%)
High risk (≥20%)

ATP3 categories
<10 
10 to 20
>20

how about:

'low' aka 'low to moderate' (<5%)
'possibly elevated' aka 'borderline' (5% to 7.4%)
'intermediate' aka 'elevated' (7.5% to 19.9%)
'high' (≥20%)

this would also mean that the age/gender details would not matter. 

they would all get lost in the low to moderate category


*/

    if (riskScore > 0.0) {

      if (gender == 1){
        if (age < 40){
          if      (riskScore <= 0.3      ) { riskText = 'low'; } 
          else if (riskScore <= 0.9 + 0.5) { riskText = 'moderate'; } 
          else if (riskScore <= 7.5      ) { riskText = 'borderline'; } 
          else if (riskScore <= 20.0     ) { riskText = 'elevated'; } 
          else if (riskScore >  20.0     ) { riskText = 'high'; }
        }
         else if (age < 45){
          if      (riskScore <= 0.4      ) { riskText = 'low'; } 
          else if (riskScore <= 1.2 + 0.6) { riskText = 'moderate'; } 
          else if (riskScore <= 7.5      ) { riskText = 'borderline'; } 
          else if (riskScore <= 20.0     ) { riskText = 'elevated'; }
          else if (riskScore >  20.0     ) { riskText = 'high'; }
        }
        else if (age < 50){
          if      (riskScore <= 0.5      ) { riskText = 'low'; } 
          else if (riskScore <= 1.6 + 0.8) { riskText = 'moderate'; } 
          else if (riskScore <= 7.5      ) { riskText = 'borderline'; } 
          else if (riskScore <= 20.0     ) { riskText = 'elevated'; }
          else if (riskScore >  20.0     ) { riskText = 'high'; }
        }
        else if (age < 55){
          if      (riskScore <= 0.7      ) { riskText = 'low'; } 
          else if (riskScore <= 2.3 + 1.0) { riskText = 'moderate'; } 
          else if (riskScore <= 7.5      ) { riskText = 'borderline'; } 
          else if (riskScore <= 20.0     ) { riskText = 'elevated'; }
          else if (riskScore >  20.0     ) { riskText = 'high'; }
        }
        else if (age >= 55){
          if      (riskScore <= 1.0      ) { riskText = 'low'; } 
          else if (riskScore <= 3.1 + 1.0) { riskText = 'moderate'; } 
          else if (riskScore <= 7.5      ) { riskText = 'borderline'; } 
          else if (riskScore <= 20.0     ) { riskText = 'elevated'; }
          else if (riskScore >  20.0     ) { riskText = 'high'; }
        }
      }

      if (gender > 1){
        if (age < 40){
          if      (riskScore == 0.1      ) { riskText = 'low'; } 
          else if (riskScore <= 0.2 + 0.1) { riskText = 'moderate'; } 
          else if (riskScore <= 7.5      ) { riskText = 'borderline'; } 
          else if (riskScore <= 20.0     ) { riskText = 'elevated'; }
          else if (riskScore >  20.0     ) { riskText = 'high'; }
        }
        else if (age < 45){
          if      (riskScore == 0.1      ) { riskText = 'low'; } 
          else if (riskScore <= 0.4 + 0.2) { riskText = 'moderate'; } 
          else if (riskScore <= 7.5      ) { riskText = 'borderline'; } 
          else if (riskScore <= 20.0     ) { riskText = 'elevated'; }
          else if (riskScore >  20.0     ) { riskText = 'high'; }
        }
        else if (age < 50){
          if      (riskScore <= 0.2      ) { riskText = 'low'; } 
          else if (riskScore <= 0.6 + 0.3) { riskText = 'moderate'; } 
          else if (riskScore <= 7.5      ) { riskText = 'borderline'; } 
          else if (riskScore <= 20.0     ) { riskText = 'elevated'; }
          else if (riskScore >  20.0     ) { riskText = 'high'; }
        }
        else if (age < 55){
          if      (riskScore <= 0.3      ) { riskText = 'low'; } 
          else if (riskScore <= 0.9 + 0.5) { riskText = 'moderate'; } 
          else if (riskScore <= 7.5      ) { riskText = 'borderline'; } 
          else if (riskScore <= 20.0     ) { riskText = 'elevated'; }
          else if (riskScore >  20.0     ) { riskText = 'high'; }
        }
        else if (age >= 55){
          if      (riskScore <= 0.5      ) { riskText = 'low'; } 
          else if (riskScore <= 1.3 + 0.7) { riskText = 'moderate'; } 
          else if (riskScore <= 7.5      ) { riskText = 'borderline'; } 
          else if (riskScore <= 20.0     ) { riskText = 'elevated'; }
          else if (riskScore >  20.0     ) { riskText = 'high'; }
        }
      }
      
    return {
      //statinText: statinText,
      riskText: riskText
    }

  } else {

    return {
      //statinText: 'unknown',
      riskText: 'unknown'
    }

  }

}